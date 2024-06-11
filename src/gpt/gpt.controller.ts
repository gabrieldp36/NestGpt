import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  public orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  };

  @Post('pros-cons-discusser')
  public prosConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  };

  @Post('pros-cons-discusser-stream')
  public async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    // Guardamos el stram con la respuesta.
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);
    // Configuramos la response.
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    // Recorremos el stream de información.
    for await (const chunck of stream) {
      const piece = chunck.choices[0].delta.content || ''; // Aquí tenemos un pieza de la respuesta.
      res.write(piece); // Vamos escribiendo pieza a pieza la respuesta.
    };
    res.end(); // indicamos que finalizó la respuesta.
  };

  @Post('translate')
  public async translate(
    @Body() translateDto: TranslateDto,
    @Res() res: Response,
  ) {
    // Guardamos el stram con la respuesta.
    const stream = await this.gptService.translateText(translateDto);
    // Configuramos la response.
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    // Recorremos el stream de información.
    for await (const chunck of stream) {
      const piece = chunck.choices[0].delta.content || ''; // Aquí tenemos un pieza de la respuesta.
      res.write(piece); // Vamos escribiendo pieza a pieza la respuesta.
    };
    res.end(); // indicamos que finalizó la respuesta.
  };
}
