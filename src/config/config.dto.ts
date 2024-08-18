import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ServerConfig {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  localDir: string;

  @IsString()
  @IsNotEmpty()
  remoteDir: string;

  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  privateKey: string;
}

export class AppConfig {
  @Type(() => ServerConfig)
  @IsNotEmpty()
  serverConfigs: ServerConfig[];
}
