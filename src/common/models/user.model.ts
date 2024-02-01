import {Status} from "../enums/status.enum";
import { Type } from "../enums/userType.enum";
import { Token } from "../enums/token.enum";
import { Role } from "../enums/role.enum";

export class UserModel{
    _id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    type: Type;
    roles: [Role];
    status: Status;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    tokenType?: Token
}
