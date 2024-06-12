import OpenAI from "openai";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

interface Options {
    prompt: string;
    voice?: string
}

export const textToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options) => { 
    
    // Configuramos la voz disponible para la conversión.
    const voices = {
        'nova'    : 'nova',
        'alloy'   : 'alloy',
        'echo'    : 'echo',
        'fable'  :  'fable',
        'onyx'    : 'onyx',
        'shimmer' : 'shimmer'
    };
    const selectedVoice = voices[voice?.toLowerCase()] ?? 'nova';

    // Generamos los path correspondientes.
    const folderPath = path.resolve(__dirname, '../../../generated/audios/');
    const speechFile = path.resolve(`${folderPath}/${uuidv4()}.mp3`);
    // Creamos recursivamente los directorios: generated -> audios.
    fs.mkdirSync( folderPath, { recursive: true } );
    // Obtenemos la conversión de texto a audio que estaremos retornando.
    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',
    });

    // Obtenemos data que va a ser parte de nuestro binario.
    const buffer = Buffer.from(await mp3.arrayBuffer());
    // Generamos el archivo.
    fs.writeFileSync(speechFile, buffer); //nombre del archivo + data;

    return speechFile // el path del archivo.
};