import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsIP,
  MinLength,
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
  @IsIP()
  host: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
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
