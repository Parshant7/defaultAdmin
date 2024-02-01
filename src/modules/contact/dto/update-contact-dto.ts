import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, isString} from 'class-validator';
import { Status } from '../enums/contact-status.enum';

export class updateContactDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
