import { IsString,  } from "class-validator";

export class TranslateDto {

    @IsString() // Validamos que sea un string.
    readonly prompt: string;
    @IsString() // Validamos que sea un string.
    readonly lang: string;
}