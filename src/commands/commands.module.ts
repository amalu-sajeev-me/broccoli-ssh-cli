import { Module } from '@nestjs/common';
import { CommandRunnerModule } from 'nest-commander';
import { SSHProvider } from '../providers/ssh.provider';
import { ShellCommand } from './shell/shell.command';
import { ShellQuestions } from './shell/quest/shell.questions';
import { EnvProvider } from '../providers/env.provider';

@Module({
  imports: [CommandRunnerModule],
  providers: [SSHProvider, ShellCommand, ShellQuestions, EnvProvider],
})
export class CommandsModule {}
