import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
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
  @Type(() => ServerConfig, {})
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  serverConfigs: ServerConfig[];
}
