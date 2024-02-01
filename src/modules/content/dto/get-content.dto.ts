import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, isString} from 'class-validator';
export class SearchContentDto {
  @IsString()
  @IsOptional()
  search: string;
}
