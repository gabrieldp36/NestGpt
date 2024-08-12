import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { MartinaAssistantModule } from './martina-assistant/martina-assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    MartinaAssistantModule
  ]
})
export class AppModule {}
