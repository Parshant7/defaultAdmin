import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches } from 'class-validator';

export class VerifyOtpDto {

  @IsString()
  @MinLength(6, { message: 'otp must be at least 6 characters long' })
  @MinLength(6, { message: 'otp must be at least 6 characters long' })
  otp: string;
}
