import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

const convertToBase64 = (file: Express.Multer.File) => {
  const data = fs.readFileSync(file.path);
  const base64 = Buffer.from(data).toString('base64');
  return `data:image/${file.mimetype.split('/')[1]};base64,${base64}`;
};

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  
  const { imageFile, prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo', //'gpt-4-vision-preview',
    max_tokens: 1000,
    temperature: 0.1,
    messages: [
      { 
        role: "system", 
        content: `
          Te serán proveídas imagenes y tienes que identificar todos los datos que figuren en la misma.
          Las respuestas tienen que ser brindadas en formato JSON.
        ` 
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt || 'Identifica todo la información que ves en la imagen',
          },
          {
            type: 'image_url',
            image_url: {
              url: convertToBase64(imageFile),
            },
          },
        ],
      },
    ],
    response_format: {
      type: 'json_object',
    }
  });

  // Una vez analizada la imagen, la eliminamos del servidor.
  fs.unlinkSync(imageFile.path);

  const jsonResponse = JSON.parse(completion.choices[0].message.content)
  return jsonResponse;
};
