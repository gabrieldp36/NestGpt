import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { audioToTextUseCase, imageGenerationUseCase, imageToTextUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDicusserUseCase, prosConsStreamUseCase, textToAudioUseCase, translateUseCase, } from './uses-cases';
import { AudioToTextDto, ImageGenarationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { getterFile } from "src/helpers/getter-file";

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
        return getterFile('../../generated/audios/', fileId, 'mp3');;
    };
    
    public async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase( this.openai, { audioFile, prompt } );
    };

    public async imageGeneration(imageGenarationDto:ImageGenarationDto) {
        return await imageGenerationUseCase( this.openai, {...imageGenarationDto} );
    };
 
    public async imageVariation({ baseImage }:ImageVariationDto) {
        return await imageVariationUseCase( this.openai, { baseImage } );
    };

    public async imageGenerationGetter(fileName: string) { 
        return getterFile('../../generated/images/', fileName);
    };

    public async imageToText(imageFile: Express.Multer.File, prompt: string) {
        return await imageToTextUseCase(this.openai, { imageFile, prompt });
    };
}
