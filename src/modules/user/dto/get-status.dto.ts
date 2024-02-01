import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class statusDto {
  @IsEnum(Status)
  @IsNotEmpty()
  @IsOptional()
  status: Status;
}
