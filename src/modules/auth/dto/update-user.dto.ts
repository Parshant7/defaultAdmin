import {IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+\d{1,2}\s\d{10}$/)
    @IsOptional()
    phone: string;
}
