import { InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';

export const downloadImageAsPng = async (url: string) => {

    // Descargamos la imagen.
    const response = await fetch(url);

    // Validamos que la descarga haya sido exitosa.
    if(!response.ok) {
        throw new InternalServerErrorException('No se ha podido descargar la imagen');;
    };

    // Creamos la carpeta para almacenar la imágenes.
    const folderPath = path.resolve('./', './generated/images/');

    // Nombramos la imagen.
    const imgNamePng = `${uuidv4()}.png`;

    // Generamos el buffer que permite grabar el archivo.
    const buffer = Buffer.from( await response.arrayBuffer() );

    // Convertimos el archivo a png y lo guardamos el archivo.
    const completePath = path.join(folderPath, imgNamePng);
    await sharp(buffer).png().ensureAlpha().toFile(completePath);

    return {
        fileName: imgNamePng,
        path: completePath,
    };
};

export const downloadBase64ImageAsPng = async (base64Image: string) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imgNamePng = `${uuidv4()}-64.png`;
    
    // Transformar a RGBA, png // Así lo espera OpenAI
    const completePath = path.join(folderPath, imgNamePng);
    await sharp(imageBuffer).png().ensureAlpha().resize(1024,1024).toFile(completePath);
  
    return {
        fileName: imgNamePng,
        path: completePath,
    };
};