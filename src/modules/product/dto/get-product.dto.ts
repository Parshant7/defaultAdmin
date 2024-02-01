import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import { Category } from '../enums/category.enum';

export class SearchProductDto {
  @IsEnum(Category)
  @IsNotEmpty()
  @IsOptional()
  category: Category;

  @IsNumber()
  @IsOptional()
  ltPrice: number;

  @IsString()
  @IsOptional()
  search: string;
}
