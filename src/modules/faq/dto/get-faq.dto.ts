import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class SearchFaqDto {
  @IsString()
  @IsOptional()
  search: string;
}
