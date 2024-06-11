import { IsString,  } from "class-validator";

export class ProsConsDiscusserDto {

    @IsString() // Validamos que sea un string.
    readonly prompt: string;
}