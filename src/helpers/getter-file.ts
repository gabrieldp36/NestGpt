import * as path from "path";
import * as fs from "fs";
import { NotFoundException } from "@nestjs/common";

export const getterFile = async (dir: string, fileName: string, extension?: string) => { 

    let filePath = ''
    
    if(extension) {
        filePath = path.resolve(__dirname, `${dir}`, `${fileName}.${extension}`);
    } else {
        filePath = path.resolve(__dirname, `${dir}`, `${fileName}`);
    };

    if ( !fs.existsSync(filePath) ) throw new NotFoundException(`No se ha encontrado el archivo con id ${fileName}`);
    return filePath;
};