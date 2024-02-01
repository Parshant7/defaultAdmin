import { Category } from "src/modules/product/enums/category.enum";

export class ProductModel{
    _id: number;
    productName: string;
    description: string;
    category: Category;
    // images: [{ originalname: string; mimetype: string }];
    regularPrice: number;
    salePrice: number;
}
