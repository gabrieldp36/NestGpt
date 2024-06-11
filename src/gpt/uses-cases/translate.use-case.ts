import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async (openai: OpenAI, { prompt, lang }: Options) => {
    
    return await openai.chat.completions.create({
        stream: true,
        messages: [
            { 
                role: "system", 
                content: `
                  Tienes que traducir el siguiente texto al idioma ${lang}: ${ prompt }.
                  Debes responder de manera amable, usando emoticones.
                ` 
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        model: "gpt-4o",
        temperature: 0.2,
    });
};