import { Schema } from 'mongoose';
import { Category } from '../enums/category.enum';

export const ProductSchema = new Schema({
  productName: {
    type: String,
    require: true
  },
  category: {
    type: String,
    enum: Category
  },
  description: {
    type: String,
    require: true
  },
  images: [
    { type: String },
  ],
  regularPrice: Number,
  salePrice: Number
}).index({ productName: "text", description: "text" });

