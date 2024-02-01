import { Schema } from 'mongoose';
import { Otp as OtpType } from '../../../common/enums/otp.enum';

export const OtpSchema = new Schema({
  pin: String,
  to: { type: String, unique: true},
  generatedAt: Date,
  expireAt: Date,
  type: {
    enum: OtpType,
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
});
