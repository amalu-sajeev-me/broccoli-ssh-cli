import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CommandsModule],
})
export class AppModule {}
