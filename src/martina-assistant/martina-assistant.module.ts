import { Module } from '@nestjs/common';
import { MartinaAssistantService } from './martina-assistant.service';
import { MartinaAssistantController } from './martina-assistant.controller';

@Module({
  controllers: [MartinaAssistantController],
  providers: [MartinaAssistantService],
})
export class MartinaAssistantModule {}
