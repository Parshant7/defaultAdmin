import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, isString} from 'class-validator';
export class SearchDto {
  @IsString()
  @IsOptional()
  search: string;
}
