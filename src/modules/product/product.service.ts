import { HttpException, HttpStatus, Injectable, Search } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types, isValidObjectId } from 'mongoose';
import { ProductModel } from 'src/common/models/product.model';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/get-product.dto';
import { Category } from './enums/category.enum';

@Injectable()
export class ProductService {
  constructor(@InjectModel('products') private Product: Model<ProductModel>) {}

  async addProduct(payload: AddProductDto, image: any): Promise<ProductModel> {
    console.log(' payload ', payload, ' image ', image);
    const product = {
      productName: payload.productName,
      description: payload.description,
      category: payload.category,
      images: image,
      regularPrice: payload.regularPrice,
      salePrice: payload.salePrice,
    };

    const newProduct = await this.Product.create(product);

    return newProduct;
  }

  async updateProduct(
    id: string,
    payload: UpdateProductDto,
    image: any,
  ): Promise<ProductModel> {
    console.log(' payload ', payload, ' image', image, 'param ', id);

    if (!Types.ObjectId.isValid(id)) {
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

    // const updatedProduct = await this.Product.findByIdAndUpdate(id, updations); // to replace existing images
    let updatedProduct = await this.Product.findByIdAndUpdate(id, {
      $pull: { images: { _id: { $in: payload.removeImages } } },
    });

    updatedProduct = await this.Product.findByIdAndUpdate(id, {
      ...updations,
      $push: { images: image },
    });
    // to push and pull images from the existing array;

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
}
