import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkRunCompleteStatusUseCases, createMessageUseCases, createRunUseCases, createThreadUseCases, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dtos';

@Injectable()
export class MartinaAssistantService {

    // Instanciamos el objeto OpenAi y configuramos la apiKey.
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    public async createThread() {
        return await createThreadUseCases(this.openai);
    };

    public async userQuestion( {threadId, question}: QuestionDto ) {

        // Creamos el mensaje y los agregamos al thread (hilo).
        await createMessageUseCases( this.openai, {threadId, question} );

        // Creamos y ejecutamos el run para que, en base al hilo de la conversación 
        // (último mensaje y previos), se emita una respuesta.
        const run = await createRunUseCases( this.openai, {threadId} );

        // Ejecutamos esta función para ir consultando el estado de la ejecución.
        // Cuando el status sea 'complete', tendremos la respuesta al mensaje del usuario.
        await checkRunCompleteStatusUseCases( this.openai, {runId: run.id, threadId} );

        // Obtenemos los mensajes a retornar.
        const messages = await getMessageListUseCase(this.openai, {threadId});

        return messages.reverse();
    };
}
