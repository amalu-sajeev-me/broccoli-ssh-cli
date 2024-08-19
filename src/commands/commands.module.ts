import { Module } from '@nestjs/common';
import { CommandRunnerModule } from 'nest-commander';
import { SSHProvider } from '../providers/ssh.provider';
import { ShellCommand } from './shell/shell.command';
import { ShellQuestions } from './shell/questions/shell.questions';
import { EnvProvider } from '../providers/env.provider';
import { ConfigCommand } from './config/config.command';
import { RootCommand } from './root/root.command';
import { ConfigOperationsProvider } from '../providers/config-operations.provider';
import { ConfigQuestions } from './config/questions/config.questions';

@Module({
  imports: [CommandRunnerModule],
  providers: [
    SSHProvider,
    RootCommand,
    ShellCommand,
    ShellQuestions,
    EnvProvider,
    ConfigCommand,
    ConfigOperationsProvider,
    ConfigQuestions,
  ],
})
export class CommandsModule {}
