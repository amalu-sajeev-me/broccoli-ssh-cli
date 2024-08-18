import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseProvider } from './base-provider';
import { ServerConfig } from '../config/config.dto';

@Injectable()
export class EnvProvider extends BaseProvider {
  constructor(private configService: ConfigService) {
    super(EnvProvider.name);
  }

  getServerConfigs(): ServerConfig[] {
    return this.configService.get<ServerConfig[]>('serverConfigs');
  }
}
