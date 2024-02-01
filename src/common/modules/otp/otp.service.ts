import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { otpGen } from 'otp-gen-agent';
import { OtpModel } from 'src/common/models/otp.model';
import { UserModel } from 'src/common/models/user.model';
import { Otp as OtpType } from 'src/common/enums/otp.enum';
import * as moment from 'moment';
import { Twilio } from 'twilio';


@Injectable()
export class OtpService {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    @InjectModel('otps') private Otp: Model<OtpModel>,
    private readonly mailerService: MailerService,
  ) {}

  async sendOtp(email: string, type: OtpType): Promise<boolean> {
    const randomPin = await otpGen();

    //send the mail to the user's email
    this.mailerService.sendMail({
      to: email,
      // from: 'laisha.erdman35@ethereal.email',
      subject: 'Verify Otp',
      text: randomPin,
      html: `<b>${randomPin}<b>`,
    });

    //update the whole object of otp
    const newOtp = {
      pin: randomPin,
      createdAt: moment().toDate(),
      expiryDate: moment().add(1, 'h').toDate(),
      to: email,
      isVerified: false,
      type: type,
    };

    const otpDoc = await this.Otp.findOneAndUpdate({ to: email }, newOtp, {
      upsert: true,
    });
    return !!otpDoc ? true : false;
  }

  async verifyOtp(
    otpRecieved: string,
    address: string | any,
    type: OtpType,
  ): Promise<any> {
    if (!address) {
      throw new UnauthorizedException('address not received');
    }
    if (!otpRecieved) {
      throw new BadRequestException('OTP not received');
    }
    const otpDoc = await this.Otp.findOne({ to: address });
    console.log('this is the otpDoc ', otpDoc);
    if (!!!otpDoc) {
      throw new BadRequestException(`Otp not generated`);
    }

    // checking if otp already used or wrong pin provided or wrong type;
    if (
      otpDoc?.isVerified ||
      otpRecieved != otpDoc?.pin ||
      otpDoc.type != type
    ) {
      throw new BadRequestException('Invalid otp');
    }

    // checking if otp expired
    if (moment(otpDoc.expireAt).isBefore(moment())) {
      throw new BadRequestException('Otp expired');
    }

    //here otp is correct and verified
    await this.Otp.findByIdAndUpdate(otpDoc._id, { isVerified: true });
    return true;
  }

  async sendSMS (phoneNumber: string, type: OtpType){
    try {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
      const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

      const randomPin = await otpGen();
      console.log("this is the phone number ", phoneNumber);
      
      const smsResponse = await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: randomPin,
      });
      
      console.log(smsResponse.sid);
       //update the whole object of otp
      const newOtp = {
        pin: randomPin,
        createdAt: moment().toDate(),
        expiryDate: moment().add(1, 'h').toDate(),
        isVerified: false,
        type: type,
      };

      const otpDoc = await this.Otp.findOneAndUpdate({ to: phoneNumber }, newOtp, {
        upsert: true,
        new: true
      });

      return !!otpDoc ? true : false;

    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  };
}

export class MessageService {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(email: string, subject: string, description: string) {
    //send the mail to the user's email
      return await this.mailerService.sendMail({
        to: email,
        // from: 'laisha.erdman35@ethereal.email',
        subject: subject,
        text: description,
        html: `<b>${description}<b>`,
      });
  }

  async sendSMS (phoneNumber: string, message: string){
    try {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
      const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      
      const smsResponse = await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: message,
      });
      
      console.log(smsResponse.sid);
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  };
}
