import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class idDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
