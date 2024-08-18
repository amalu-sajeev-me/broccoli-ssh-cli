import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';
import { ConfigModule } from '@nestjs/config';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { plainToInstance } from 'class-transformer';
import { AppConfig } from './config/config.dto';
import { validateSync } from 'class-validator';
import { EnvProvider } from './providers/env.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [
        () => {
          const configFile = readFileSync('config.yml', 'utf8');
          const config = yaml.load(configFile, {}) as Record<string, unknown>;
          const configInstance = plainToInstance(AppConfig, config);
          const errors = validateSync(configInstance, {
            skipMissingProperties: false,
          });
          if (errors.length > 0)
            throw new Error(`Configuration validation error: ${errors}`);
          return configInstance;
        },
      ],
    }),
    CommandsModule,
  ],
  providers: [EnvProvider],
})
export class AppModule {}
