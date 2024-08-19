import { Injectable } from '@nestjs/common';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { ServerConfig } from 'src/config';
import { SSHProvider } from '../../providers/ssh.provider';
import { Logger } from '../../utils/logger';
@Injectable()
@Command({
  name: 'ssh',
  description: 'run an interactive shell on your remote server',
})
export class ShellCommand extends CommandRunner {
  private readonly logger = new Logger('');
  constructor(
    private readonly _inquirer: InquirerService,
    private readonly _sshProvider: SSHProvider,
  ) {
    super();
  }
  run = async (
    passedParams: string[],
    options?: Record<'config' | 'node', any>,
  ): Promise<void> => {
    const { server } = (await this._inquirer.ask('shell', {})) as Record<
      'server',
      ServerConfig
    >;

    if (options.node) {
      await this._sshProvider.connect(server);
      await this._sshProvider.startInteractiveShell();
      return;
    } else if (options.config) return console.table(server);
    return this._sshProvider.runNativeSSHCommand(server);
  };

  @Option({
    flags: '-c, --config [config]',
    description: 'Prints the selected server configuration',
    name: 'config',
  })
  addServerOptionParse() {
    return true;
  }

  @Option({
    flags: '-n, --node [node]',
    name: 'native',
    description: 'use native ssh command to connect',
  })
  useNativeSSH() {
    return true;
  }
}
