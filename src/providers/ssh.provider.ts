import { Injectable } from '@nestjs/common';
import { Client, ClientChannel, ConnectConfig, SFTPWrapper, Stats } from 'ssh2';
import { readFile, readdir, stat } from 'fs/promises';
import { BaseProvider } from './base-provider';
import { promisify } from 'util';
import * as chalk from 'chalk';
import { ServerConfig } from '../config/config.dto';
import { createInterface } from 'readline/promises';
import { spawn } from 'child_process';

@Injectable()
export class SSHProvider extends BaseProvider {
  private readonly _client: Client;
  private readonly _CONFIG: Exclude<ConnectConfig, 'privateKey'> = {
    port: 22,
    readyTimeout: 60000, // Increase timeout to 60 seconds
    keepaliveInterval: 20000, // Send keepalive every 20 seconds
    keepaliveCountMax: 10, // Allow up to 10 keepalives
  };
  constructor() {
    super(SSHProvider.name);
    this._client = new Client();
  }

  connect = async (serverConfig: ServerConfig) => {
    Object.assign(this._CONFIG, serverConfig);
    const { privateKey: privateKeyPath, host, username } = serverConfig;
    const privateKey = await readFile(privateKeyPath);
    const config: ConnectConfig = {
      ...this._CONFIG,
      privateKey,
      host,
      username,
    };
    this._client.on('connect', this.onConnect);
    this._client.connect(config);
    return this;
  };

  startInteractiveShell = async () => {
    this._client.once('ready', () => {
      this._client.shell(false, {}, (err, channel) => {
        const prompt = chalk.blue(`@${this._CONFIG.host}`);
        channel.write('source ~/.bashrc\n');
        channel.write('source ~/.profile\n');
        channel.write(
          `export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.13.1/lib/node_modules\n`,
        );
        channel.write(
          `export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.13.1/bin\n`,
        );
        this.terminalSetup(channel, `[BROCCOLI-SSH-CLI] ${prompt} ~>`);
        if (err) return this.logger.error(err.message);
        this.logger.info('Interactive shell ready to use');
      });
    });
  };

  terminalSetup = (channel: ClientChannel, prompt: string) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      prompt,
    });
    const displayPromptCB = () => rl.prompt();
    console.log('events', channel.eventNames());
    channel.pipe(process.stdout);
    channel.on('error', (err) => console.log(err));
    // channel.stderr.pipe(process.stderr);
    channel.on('data', displayPromptCB);
    rl.on('line', (input) => {
      channel.write(input + '\n');
      if (input === '') displayPromptCB();
    });

    channel.on('close', () => {
      rl.close();
      console.log(chalk.yellow('Connection closed.'));
      this._client.end();
    });
    rl.on('SIGINT', () => {
      channel.close();
    });
  };
  onReady = async () => {
    this.logger.info('connection ready!');
    const remoteDir = ''; // replace
    const sFTP = await this.sFTP();
    await this.deleteFileOrFolder(remoteDir, sFTP);
  };
  onConnect = () => {
    console.log(
      `succesfully connected to ${this._CONFIG.username}@${this._CONFIG.host}`,
    );
  };
  connection = () => this._client;
  onData = (data) => {
    console.log(data);
  };
  private async sFTP(): Promise<SFTPWrapper> {
    return new Promise((resolve, reject) => {
      this._client.sftp((err, sftp) => {
        if (err) return reject(err);
        return resolve(sftp);
      });
    });
  }
  async deleteFileOrFolder(
    remotePath: string,
    sFTP: SFTPWrapper,
  ): Promise<SFTPWrapper> {
    const readDirSFTP = promisify(sFTP.readdir);
    const rmDirSFTP = promisify(sFTP.rmdir);
    const unlinkSFTP = promisify(sFTP.unlink);
    const remotePathStat = await stat(remotePath);
    if (remotePathStat.isDirectory()) {
      this.logger.info(`reading ${remotePath}`);
      const fileList = await readDirSFTP(remotePath);
      for (const file of fileList) {
        await this.deleteFileOrFolder(`${remotePath}/${file.filename}`, sFTP);
      }
      await rmDirSFTP(remotePath);
      this.logger.success(`Successfully removed ${remotePath}`);
    } else {
      this.logger.info(`removing file :: ${remotePath}`);
      await unlinkSFTP(remotePath);
      this.logger.success(`Successfully removed ${remotePath}`);
    }
    return sFTP;
  }
  private getFileStat(path: string, sFTP: SFTPWrapper): Promise<Stats> {
    return new Promise(async (resolve, reject) => {
      sFTP.stat(path, (err, stats) => {
        if (err) {
          console.log(err.message);
          return reject(err);
        }
        console.log(`fetching stats for ${path}`);
        return resolve(stats);
      });
    });
  }
  private uploadFiles(
    localDirPath: string,
    remotePath: string,
    sFTP: SFTPWrapper,
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(`reading LOCAL DIR:: ${localDirPath}`);
      const list = await readdir(localDirPath, {
        recursive: true,
        withFileTypes: true,
      });
      console.log(`found ${list.length} files in Local:: ${localDirPath}`);
      const directoryList = list.filter((item) => item.isDirectory());
      directoryList.forEach((dir) => {
        const uploadPath = dir.path.split(localDirPath)[1];
        console.log(`MKDIR:: ${remotePath}/${uploadPath}`);
        sFTP.mkdir(`${remotePath}/${uploadPath}`, (err) => {
          if (err) console.log(err.message, `Failed to create Dir`);
          else console.log(`MKDIR:: created ${remotePath}/${uploadPath}`);
        });
      });
      list.forEach(async (item) => {
        if (item.isFile()) {
          console.log(`${item.name} is a File`);
          const uploadPath = item.path.split(localDirPath)[1];
          sFTP.fastPut(item.path, `${remotePath}/${uploadPath}`, (err) => {
            if (err) {
              console.log(`${err.message}:: ${item.path}/${uploadPath}`);
              console.log({ err });
              return reject(err);
            }
            console.log(`succesfully uploaded ${uploadPath}`);
            resolve(true);
          });
        } else {
          console.log(`${item.name} is a Directory`);
        }
      });
    });
  }
  runNativeSSHCommand(server: ServerConfig) {
    const { privateKey, username, host, localDir } = server;
    const sshCommand = `ssh -i ${privateKey} ${username}@${host}`;

    const [command, ...args] = sshCommand.split(' ');
    const sshProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: localDir,
    });
    this.logger.success(`BROCCOLI SSH CLI`);

    sshProcess.on('exit', (code) => {
      this.logger.info(`SSH session exited with code ${code}`);
    });
    sshProcess.on('error', (err) => {
      this.logger.error(`Failed to start SSH session: ${err.message}`);
    });
  }
}
