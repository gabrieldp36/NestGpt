import { IsInt, IsOptional, IsString,  } from "class-validator";

export class OrthographyDto {

    @IsString() // Validamos que sea un string.
    readonly prompt: string;

    @IsInt() // Validamos que sea un entero.
    @IsOptional() // Indicamos que es opcional.
    readonly maxTokens?: number;
}