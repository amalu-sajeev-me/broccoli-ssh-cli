import { Injectable } from '@nestjs/common';
import { BaseProvider } from './base-provider';
import * as path from 'path';
import { access, constants, writeFile } from 'fs/promises';
import { InquirerService } from 'nest-commander';
import { ServerConfig } from '../config/config.dto';

@Injectable()
export class ConfigOperationsProvider extends BaseProvider {
  static CONFIG_FILE_NAME = 'config2.yml';
  static CONFIG_FILE_PATH = path.resolve(
    __dirname,
    '../../',
    ConfigOperationsProvider.CONFIG_FILE_NAME,
  );
  constructor(private readonly _inquirer: InquirerService) {
    super(ConfigOperationsProvider.name);
  }
  async initialize() {
    const { CONFIG_FILE_PATH, CONFIG_FILE_NAME } = ConfigOperationsProvider;
    try {
      await access(CONFIG_FILE_PATH, constants.F_OK);
    } catch (error) {
      await writeFile(CONFIG_FILE_PATH, '');
      this.logger.info(
        `Empty ${CONFIG_FILE_NAME} file created at ${CONFIG_FILE_PATH}`,
      );
      this.runCreateServerWizard();
    }
  }
  async runCreateServerWizard() {
    const answer = await this._inquirer.ask<ServerConfig>('serverConfig', {});
    console.table(answer);
  }
}
