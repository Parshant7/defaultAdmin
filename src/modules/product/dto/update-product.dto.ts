import { PartialType } from '@nestjs/mapped-types';
import { AddProductDto } from './add-product.dto';
import { ArrayMaxSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateProductDto extends PartialType(AddProductDto){
    @IsArray()
    @ArrayMaxSize(20)
    @IsOptional()
    removeImages: string[];
}

