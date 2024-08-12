import OpenAI from "openai";

interface Options {
    threadId: string;
    question: string;
};

export const createMessageUseCases = async (openai: OpenAI, options: Options) => { 

    const { threadId, question } = options;

    // Creamos mensaje dentro de nuestro thread (el hilo de la conversación).
    const message = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: question,
    });

    return message;
};