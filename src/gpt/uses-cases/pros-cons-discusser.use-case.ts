import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {

    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta de manera amable con pros y contras.
                    La respuesta debe de ser en formato markdown. 
                    Los pros y contras deben de estar en una lista que identifique 
                    cada pro y contra con un emoticon que sea representativo de la ventaja o contra que se describe.
                    La respuesta brindada debe ser de fácil lectura, 
                    los párrafos deben estar espaciados con saltos de linea.
                    Los elementos a comparar deben en mayúscula, negrita, tamaño de letra 2 ##, una línea divisoria.
                    Las palabras Pros y Contas deben estar en negrita.
                ` 
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        model: "gpt-4o",
        temperature: 0.1,
    });

    return completion.choices[0].message;
};