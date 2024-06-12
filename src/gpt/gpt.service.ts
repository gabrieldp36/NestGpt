import * as path from "path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from "openai";
import { orthographyCheckUseCase, prosConsDicusserUseCase, prosConsStreamUseCase, textToAudioUseCase, translateUseCase, } from './uses-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

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

    public async textToAudio( { prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase( this.openai, { prompt, voice } );;
    };

    public async textToAudioGetter(fileId: string) { 
        const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
        if ( !fs.existsSync(filePath) ) throw new NotFoundException(`No se ha encontrado el archivo con id ${fileId}`);
        return filePath;
    };
}
