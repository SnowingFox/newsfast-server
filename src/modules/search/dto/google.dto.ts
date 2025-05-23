import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class GoogleSearchBody {
  @MaxLength(1000)
  @MinLength(1)
  @IsString()
  keyword: string;

  @IsString()
  @IsOptional()
  format?: 'markdown';
}