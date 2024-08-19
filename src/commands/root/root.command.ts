import { Injectable } from '@nestjs/common';
import {
  CommandRunner,
  Option,
  RootCommand as NestRootCommand,
} from 'nest-commander';
import { ConfigOperationsProvider } from '../../providers/config-operations.provider';

@Injectable()
@NestRootCommand({
  name: '',
  description: 'BROCCOLI SSH CLI Tool',
})
export class RootCommand extends CommandRunner {
  constructor(
    private readonly _configOperationsProvider: ConfigOperationsProvider,
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<'init', any>,
  ): Promise<void> {
    if (options.init) this._configOperationsProvider.initialize();
    return;
  }

  @Option({
    flags: '-i --init [init]',
    name: 'init',
    description: 'Initialize the config file',
  })
  initialize() {
    return true;
  }
}
