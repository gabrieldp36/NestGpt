import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsStreamUseCase, translateUseCase, } from './uses-cases';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {

    // Instanciamos el objeto OpenAi y configuramos la apiKey.
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    // En nuestro GptService sólo vamos a llamar a los casos de uso.
    public async orthographyCheck( { prompt }: OrthographyDto) {
        return await orthographyCheckUseCase( this.openai, { prompt } );
    };

    public async prosConsDicusser( { prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase( this.openai, { prompt } );
    };

    public async prosConsDicusserStream( { prompt }: ProsConsDiscusserDto) {
        return await prosConsStreamUseCase( this.openai, { prompt } );
    };

    public async translateText( { prompt, lang }: TranslateDto) {
        return await translateUseCase( this.openai, { prompt, lang } );
    };
}
