import { IsString } from "class-validator";

export class RecognizeDto {
  @IsString()
  image: string;
}
