import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
};

export const audioToTextUseCase = async (openai: OpenAI, { prompt, audioFile }: Options) => {

    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path),
        prompt: prompt, // El prompt de ser redactado en el mismo idioma del audio.
        language: 'es', // Incluir el idioma siguiendo el formato ISO-639-1.
        response_format: 'verbose_json'
    });

    return response;
};