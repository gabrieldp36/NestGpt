import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { orthographyCheckUseCase } from './uses-cases';
import { OrthographyDto } from './dtos';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    // En nuestro GptService sólo vamos a llamar a los casos de uso.

    public async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt,
        });
    };
}
