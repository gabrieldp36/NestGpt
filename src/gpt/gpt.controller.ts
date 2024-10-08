import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenarationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';


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

  @Post('text-to-audio')
  public async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  };


  @Get('text-to-audio/:fileId')
  public async getTextToAudio(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  };

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1000 * 1024 * 5 }, // Hasta 5 MB.
      fileFilter: (req, file, callback) => {
        const types: string[] = ['audio'];
        if( !types.includes(file.mimetype.split('/').shift()) ) {
          return callback(null, false);
        };
        return callback(null, true);
      },
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => { 
          const fileExtension: string = file.originalname.split('.').pop();
          const filename: string = `${uuidv4()}.${fileExtension}`;
          return callback(null, filename);
        },
      }),
    }),
  )
  public async audioToText(
    @Req() req: Request,
    @Res() res: Response,
    @Body() audioToTextDto: AudioToTextDto,
  )
  {
    if(!req.file) {
      res.status(HttpStatus.BAD_REQUEST);
      return res.json({ msg: 'Archivo no permitido. Solo se admiten archivos de tipo audio/*' });
    };

    const response = await this.gptService.audioToText(req.file, audioToTextDto);
    return res.status(HttpStatus.OK).json(response);
  };

  @Post('image-generation')
  public async imageGeneration(
    @Body() imageGenerationDto: ImageGenarationDto,
  ) {
    return await this.gptService.imageGeneration( imageGenerationDto );
  };

  @Post('image-variation')
  public async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ) {
    return await this.gptService.imageVariation( imageVariationDto );
  };

  @Get('image-generation/:fileId')
  public async getImageGeneration(
    @Param('fileId') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.imageGenerationGetter(fileName);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  };

  @Post('extract-text-from-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1000 * 1024 * 2 }, // Hasta 5 MB.
      fileFilter: (req, file, callback) => {
        const types: string[] = ['image'];
        if( !types.includes(file.mimetype.split('/').shift()) ) {
          return callback(null, false);
        };
        return callback(null, true);
      },
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => { 
          const fileExtension: string = file.originalname.split('.').pop();
          const filename: string = `${uuidv4()}.${fileExtension}`;
          return callback(null, filename);
        },
      }),
    }),
  )
  public async extractTextFromImage(
    @Req() req: Request,
    @Res() res: Response,
    @Body('prompt') prompt: string,
  ) {

    if(!req.file) {
      res.status(HttpStatus.BAD_REQUEST);
      return res.json({ msg: 'Archivo no permitido. Solo se admiten archivos de tipo image/*' });
    };

    const response = await this.gptService.imageToText(req.file, prompt);;
    return res.status(HttpStatus.OK).json(response);
  };
} 
