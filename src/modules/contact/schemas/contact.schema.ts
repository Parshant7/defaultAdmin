import { Schema } from 'mongoose';
import { Status } from '../enums/contact-status.enum';

export const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    enum: Status,
    type: String,
    default: Status.Open
  }
}).index({ message: "text"});
