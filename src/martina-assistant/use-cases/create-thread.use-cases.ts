import OpenAI from "openai";

export const createThreadUseCases = async (openai: OpenAI) => {
    const { id } = await openai.beta.threads.create();
    return { id };
};