import * as fs from "fs";
import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
};

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt, originalImage, maskImage } = options;

    if(!originalImage || !maskImage) {

        const response = await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url',
        });
    
        // Guardamos la imagen generada.
        const { fileName } = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    
        return {
            url,
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt,
        };
    };

    const { path: pngImagePath }= await downloadImageAsPng(originalImage);
    const { path: maskPath } = await downloadBase64ImageAsPng(maskImage);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });

    // Guardamos la imagen editada.
    const { fileName } = await downloadImageAsPng(response.data[0].url);
    const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    // Limpiamos la imágenes utilizadas para la edición.
    fs.unlinkSync(pngImagePath);
    fs.unlinkSync(maskPath);

    return {
        url: publicUrl,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
    };
};