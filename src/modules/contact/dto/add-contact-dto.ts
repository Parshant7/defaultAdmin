import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches, MaxLength } from 'class-validator';

export class AddContactDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
