import { Schema } from 'mongoose';
import { Type as UserType } from '../../../common/enums/userType.enum';
import { Status } from '../../../common/enums/status.enum';
import { Role } from 'src/common/enums/role.enum';

export const UserSchema = new Schema({
  image: {
      originalname: { type: String },
      mimetype: { type: String },
      path: String,
  },
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true},
  password: String,
  type: {
    enum: UserType,
    type: String,
    default: UserType.User
  },
  status: {
    enum: Status,
    type: String,
    default: Status.Active
  },
  roles: [{
    enum: Role,
    type: String,
    default: Role.None,
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  }
}).index({name: "text", email: "text", roles: 1});
