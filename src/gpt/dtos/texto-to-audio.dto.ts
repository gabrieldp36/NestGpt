import { IsOptional, IsString,  } from "class-validator";

export class TextToAudioDto {

    @IsString() // Validamos que sea un string.
    readonly prompt: string;
    @IsString() 
    @IsOptional() // Indicamos que es una propiedad opcional.
    readonly voice?: string;
}