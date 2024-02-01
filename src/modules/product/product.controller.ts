import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './dto/add-product.dto';
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from 'src/config/multer.config';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/get-product.dto';
import { UserType } from 'src/common/decorators/userType.decorators';

import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { Type } from 'src/common/enums/userType.enum';

@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Post("") //add product
    @UseInterceptors(FilesInterceptor('image', +process.env.MAX_IMAGE_COUNT, multerOptions))
    async addProduct(@Body() body: AddProductDto, @UploadedFiles() image: Array<Express.Multer.File>){
        return this.productService.addProduct(body, image);
    }

    @Patch("/:id") //update product
    @UseInterceptors(FilesInterceptor('image', +process.env.MAX_IMAGE_COUNT, multerOptions))
    async updateProduct(@Param("id") id: string, @Body() body: UpdateProductDto, @UploadedFiles() image: Array<Express.Multer.File>){
        return this.productService.updateProduct(id, body, image);
    }

    @Get("") //get products
    async getProducts(@Query() query: SearchProductDto){
        return this.productService.getProducts(query);
    }

    @Get("/:id") //get products by id
    async getProduct(@Param("id") id: string){
        return this.productService.getProduct(id);
    }
}
