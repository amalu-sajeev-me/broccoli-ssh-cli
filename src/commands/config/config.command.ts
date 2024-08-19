import { Injectable } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { EnvProvider } from '../../providers/env.provider';

@Injectable()
@Command({
  name: 'config',
  description: 'Operations on the configuration file (config.yml)',
})
export class ConfigCommand extends CommandRunner {
  constructor(private readonly _envProvider: EnvProvider) {
    super();
  }
  run(passedParams: string[], options?: Record<'show', any>): Promise<void> {
    if (options.show)
      this._envProvider
        .getServerConfigs()
        .forEach((config) => console.table(config));
    return;
  }

  @Option({
    flags: '-s --show [show]',
    description: 'show all server configurations',
  })
  showAll() {
    return true;
  }

  @Option({
    flags: '-a --add <add>',
    name: 'serverName',
    defaultValue: 'Remote Server 1',
    description: 'Add a new server to the config',
  })
  addServerParser(value: string) {
    return value;
  }
}
