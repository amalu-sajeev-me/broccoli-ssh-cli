import { Injectable } from '@nestjs/common';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { ServerConfig } from 'src/config';
import { SSHProvider } from '../../providers/ssh.provider';
@Injectable()
@Command({
  name: 'ssh',
  description: 'run an interactive shell on your remote server',
})
export class ShellCommand extends CommandRunner {
  constructor(
    private readonly _inquirer: InquirerService,
    private readonly _sshProvider: SSHProvider,
  ) {
    super();
  }
  run = async (): Promise<void> => {
    const { server } = (await this._inquirer.ask('shell', {})) as Record<
      'server',
      ServerConfig
    >;
    await this._sshProvider.connect(server.privateKey);
    await this._sshProvider.startInteractiveShell();
  };
}
