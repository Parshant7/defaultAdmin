import { Schema } from 'mongoose';

export const FaqSchema = new Schema({
  question: {
    type: String,
    require: true
  },
  answer: {
    type: String,
    require: true
  },
}).index({ question: "text", answer: "text" });

