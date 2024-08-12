import OpenAI from "openai";

interface Options {
    threadId: string;
    runId: string;
};

export const checkRunCompleteStatusUseCases = async (openai: OpenAI, options: Options) => { 

    const { threadId, runId } = options;

    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    if(runStatus.status === 'completed') return runStatus;

    // Regulamos el tiempo de consulta para evirtar un bloqueo por parte de los servidores de OpenIA.
    await new Promise( resolve => setTimeout(resolve, 1000) );
    
    // llamado recursivo para ir chequeando la evolución del status.
    return await checkRunCompleteStatusUseCases(openai, options);
};