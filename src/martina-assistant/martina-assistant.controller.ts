import { Body, Controller, Post } from '@nestjs/common';
import { MartinaAssistantService } from './martina-assistant.service';
import { QuestionDto } from 'src/martina-assistant/dtos/question.dtos';

@Controller('martina-assistant')
export class MartinaAssistantController {

  constructor(private readonly martinaAssistantService: MartinaAssistantService) {};

  @Post('create-thread')
  async createThread() {
    return await this.martinaAssistantService.createThread();
  };

  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto
  ) {
    return await this.martinaAssistantService.userQuestion(questionDto);
  };
}
