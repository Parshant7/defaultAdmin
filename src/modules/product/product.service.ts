import { HttpException, HttpStatus, Injectable, Search } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types, isValidObjectId } from 'mongoose';
import { ProductModel } from 'src/common/models/product.model';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/get-product.dto';
import { Category } from './enums/category.enum';
import { UploadService } from 'src/common/modules/upload/upload.service';
import { array } from 'joi';

@Injectable()
export class ProductService {
  constructor(@InjectModel('products') private Product: Model<ProductModel>,
  private readonly uploadService: UploadService
  ) {}

  async addProduct(payload: AddProductDto, images: any): Promise<ProductModel> {
    console.log(' payload ', payload, ' image ', images);

    const product: any = {
      productName: payload.productName,
      description: payload.description,
      category: payload.category,
      regularPrice: payload.regularPrice,
      salePrice: payload.salePrice,
    };

    if(images){
      const uploadedImages = await this.uploadImages(images);
      product.images = uploadedImages;
    }

    const newProduct = await this.Product.create(product);

    return newProduct;
  }


  async updateProduct(
    id: string,
    payload: UpdateProductDto,
    images: any,
  ): Promise<ProductModel> {
    console.log(' payload ', payload, ' images', images, 'param ', id);

    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    const product = await this.Product.findById(id);

    if (!product) throw new HttpException('Invalid id', HttpStatus.NOT_FOUND);

    let updations = {
      productName: payload.productName,
      description: payload.description,
      category: payload.category,
      regularPrice: payload.regularPrice,
      salePrice: payload.salePrice,
    } as any;

    updations = Object.fromEntries(
      Object.entries(updations).filter(([_, v]) => v != null),
    );

    // to update and remove the existing images and 
    console.log(" removed images ", payload.removeImages);
    let updatedProduct = await this.Product.findByIdAndUpdate(id, {
      ...updations,
      $pull: { images: { $in: payload.removeImages } },
    }, {new: true});

    // to push images to the existing array;
    if(images && images.length){
      const uploadedImages = await this.uploadImages(images);
      console.log("uploaded images are ", uploadedImages); 
      updatedProduct = await this.Product.findByIdAndUpdate(id, {
        $push: { images: uploadedImages },
      }, {new: true});
    }

    return updatedProduct;
  }

  async getProducts(query: SearchProductDto): Promise<ProductModel[]> {

    console.log('query ', query);

    const filter = {} as any;

    if(query.category){
        filter.category = query.category;
    }
    if(query.ltPrice){
        filter.salePrice = {
            $lt: query.ltPrice
        }
    }
    if(query.search){
        filter["$text"] = {
            $search: query.search,
        }
    }
    console.log("filter: ",filter);

    const products = await this.Product.find(filter);
    if(!products)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return products;
  }    


  async getProduct(id: string): Promise<ProductModel> {

    console.log('id ', id);

    if(!isValidObjectId(id))
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)
    
    const product = await this.Product.findById(id);

    if(!product)
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    console.log("product: ",product);
    return product;
  }    

  async uploadImages(images: Express.Multer.File): Promise<string[]>{
    if(images instanceof Array){
      const uploadedImages = [];

      for(let i=0; i<images.length; i++){
        const uploadedImage = await this.uploadService.uploadImage(images[i]);
        uploadedImages.push(uploadedImage.Location);
      }
      return uploadedImages;
    }
    else{
      const uploadedImage = await this.uploadService.uploadImage(images);
      return uploadedImage.Location;
    }
  }
}
