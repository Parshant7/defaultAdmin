import { Otp as OtpType } from '../../common/enums/otp.enum';

export class OtpModel{
    _id: number;
    pin: string;
    to: string;
    generatedAt: Date;
    expireAt: Date;
    type: OtpType;
    isVerified: boolean;
}
