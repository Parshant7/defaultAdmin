import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { RegisterStaffDto } from './register-staff.dto';

export class UpdateStaffDto extends PartialType(RegisterStaffDto) {}
