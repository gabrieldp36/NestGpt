import * as fs from "fs";
import OpenAI from "openai";
import { downloadImageAsPng } from '../../helpers/download-image-as-png';

interface Options {
    baseImage: string;
};

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => { 
    const { baseImage } = options;
    
    const { path: pngImagePath } = await downloadImageAsPng(baseImage);

    const response = await openai.images.createVariation({
        model: 'dall-e-2',
        image: fs.createReadStream(pngImagePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });

    // Guardamos la variación.
    const { fileName } = await downloadImageAsPng( response.data[0].url );
    const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    // Limpiamos la imagen original utilizada para realizar la variación.
    fs.unlinkSync(pngImagePath);

    return {
        url: publicUrl,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
    };
};