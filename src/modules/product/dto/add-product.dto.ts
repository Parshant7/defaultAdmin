import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, IsDate, MinLength, Matches, MaxLength, isNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Category } from '../enums/category.enum';
import { Decimal128 } from 'mongodb';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;
 
  @IsString()
  @IsNotEmpty()
  description: string;
 
  @IsEnum(Category)
  category: Category;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999.99)
  regularPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999.99)
  salePrice: number;
  
  // @IsNotEmpty()
  // image: any
}
