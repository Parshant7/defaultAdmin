import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches, MaxLength, isNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ContentDto {
  @IsString()
  @IsNotEmpty()
  pageTitle: string;
 
  @IsString()
  @IsNotEmpty()
  description: string;
}
