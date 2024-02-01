import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches, IsArray } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { RegisterUserDto } from './registeration.dto';

export class RegisterStaffDto extends RegisterUserDto{
  @IsArray()
  @IsEnum(Role, {each: true})
  @IsNotEmpty()
  roles: string[];
}
