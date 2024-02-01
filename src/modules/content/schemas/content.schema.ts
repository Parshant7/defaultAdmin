import { Schema } from 'mongoose';

export const ContentSchema = new Schema({
  pageTitle: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image: {
      originalname: { type: String },
      mimetype: { type: String },
      path: String,
  },
}).index({ pageTitle: "text", description: "text" });
