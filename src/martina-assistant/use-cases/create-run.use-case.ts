import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
};

export const createRunUseCases = async (openai: OpenAI, options: Options) => { 

    const { threadId, assistantId = process.env.ASSISTANT_ID } = options;

    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        // instructions |CUIDADO| lo que agregamos acá sobre escribe la configuración del asistente.
        // No agreamos nada más dado que nuestro asistente ya se encuentra configurado.
    });

    return run;
};