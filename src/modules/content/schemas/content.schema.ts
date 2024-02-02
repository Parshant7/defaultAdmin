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
  image: {type: String },
}).index({ pageTitle: "text", description: "text" });
