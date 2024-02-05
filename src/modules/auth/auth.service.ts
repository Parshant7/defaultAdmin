import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
  Body,
  Req,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { RegisterUserDto } from './dto/registeration.dto';
import { LoginUserDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../../common/models/user.model';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Type as UserType } from '../../common/enums/userType.enum';
import { Otp as OtpType } from '../../common/enums/otp.enum';
import { OtpModel } from '../../common/models/otp.model';
import { Token as TokenType } from '../../common/enums/token.enum';
import { User as UserDec } from 'src/common/decorators/user.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OtpService } from 'src/common/modules/otp/otp.service';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { Role } from 'src/common/enums/role.enum';
import { UploadService } from 'src/common/modules/upload/upload.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    @InjectModel('otps') private Otp: Model<OtpModel>,
    private readonly uploadService: UploadService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  // REGISTER NEW USERS -----------------userRepository
  async register(
    payload: RegisterUserDto | RegisterStaffDto,
    userType: UserType,
    image: any,
  ): Promise<UserModel> {
    const isExists = !!(await this.User.findOne({ email: payload.email }));
    // let u:any;
    // console.log(u.name.ts);
    // if email already exists
    if (isExists) {
      throw new HttpException(
        `Email '${payload.email}' already exists.`,
        HttpStatus.CONFLICT,
      );
    }

    payload.password = await bcrypt.hash(
      payload.password,
      Number(process.env.salt),
    );

    const newUser: any = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      type: userType,
    };

    // if image is uploaded
    if (image) {
      const uploadedImage = await this.uploadService.uploadImage(image);
      console.log(uploadedImage);
      newUser.image = uploadedImage.Location;
    }
    // if registering staff
    if (payload instanceof RegisterStaffDto) {
      newUser.roles = payload.roles;
      console.log('payload is of staff type');
    } else {
      newUser.roles = Role.None;
    }

    const createdUser = await this.User.create(newUser);
    console.log('createdUser ', createdUser);
    // sending otp to the email
    // this.otpService.sendOtp(createdUser.email, OtpType.emailverification);

    return createdUser;
  }

  async login(res: Response, userCredentials: LoginUserDto): Promise<any> {
    const user = await this.User.findOne({ email: userCredentials.email });

    console.log();

    if (!user) {
      throw new HttpException(
        `Email '${userCredentials.email}' does not exist.`,
        HttpStatus.NOT_FOUND,
      );}

    const isMatch = await bcrypt.compare(
      userCredentials.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException("Incorrect Password");
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.type,
      tokenType: TokenType.AuthToken,
    };

    const access_token = await this.jwtService.signAsync(payload);

    console.log({ access_token });
    // return res.setHeader("authorization", `Bearer ${access_token}`);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
    });

    return { access_token };
  }

  async sendEmailOtp(@Req() req: Request) {
    const { email } = req.user;
    const user = await this.User.findOne({ email: email });
    if (!user) {
      throw new BadRequestException('This email is not registered');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    if (
      !(await this.otpService.sendOtp(user.email, OtpType.emailverification))
    ) {
      throw new HttpException(
        'could not send otp! Please try again after some time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return `Otp sent successfully`;
  }

  async sendPhoneOtp(@Req() req: Request) {
    const { phone } = req.user;
    const user = await this.User.findOne({ phone: phone });

    if (!user || !user.phone) {
      throw new BadRequestException('This phone is not registered');
    }
    if (user.isPhoneVerified) {
      throw new BadRequestException('Phone is already verified');
    }
    if (
      !(await this.otpService.sendSMS(user.phone, OtpType.phoneverification))
    ) {
      throw new HttpException(
        'could not send otp! Please try again after some time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return `Otp sent successfully`;
  }

  async verifyEmailOtp(@Req() req: Request, @Body() body: VerifyOtpDto) {
    const { email } = req.user;
    const user = await this.User.findOne({ email: email });
    if (!user) {
      throw new BadRequestException('This email is not registered');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    await this.otpService.verifyOtp(
      body.otp,
      user.email,
      OtpType.emailverification,
    );
    await this.User.findOneAndUpdate(
      { email: email },
      { isEmailVerified: true },
    );
    return `email successfully verified`;
  }

  async verifyPhoneOtp(@Req() req: Request, @Body() body: VerifyOtpDto) {
    const { phone } = req.user;
    const user = await this.User.findOne({ phone: phone });
    if (!user) {
      throw new BadRequestException('This phone number is not registered');
    }
    if (user.isPhoneVerified) {
      throw new BadRequestException('Phone number is already verified');
    }
    await this.otpService.verifyOtp(
      body.otp,
      user.phone,
      OtpType.phoneverification,
    );
    await this.User.findOneAndUpdate(
      { phone: phone },
      { isPhoneVerified: true },
    );
    return `Phone successfully verified`;
  }

  // send otp to the email when triggered /forgotPassword
  async forgotPassword(res: Response, body: ForgotPasswordDto): Promise<any> {
    const email = body.email;

    const user = await this.User.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('No user exists with this email');
    }

    if (!(await this.otpService.sendOtp(user.email, OtpType.forgotPassword))) {
      throw new HttpException(
        'could not send otp! Please try again after some time',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const payload = {
      _id: user._id,
      email: user.email,
      tokenType: TokenType.ResetToken,
    };
    const reset_token = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
    });

    res.cookie('access_token', reset_token, {
      httpOnly: true,
      secure: false,
    });

    return { reset_token };
  }

  async resetPassword(
    @UserDec() user: UserModel,
    body: ResetPasswordDto,
  ): Promise<any> {
    console.log('this is user', user);
    const userId = user._id;

    if (user.tokenType !== TokenType.ResetToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    await this.otpService.verifyOtp(
      body.otp,
      user.email,
      OtpType.forgotPassword,
    );

    await this.User.findByIdAndUpdate(userId, {
      password: await bcrypt.hash(body.newPassword, Number(process.env.salt)),
    });

    return 'Password reset Successfully';
  }

  async changePassword(
    @UserDec() user: UserModel,
    body: ChangePasswordDto,
  ): Promise<any> {
    console.log('this is user', user);
    const userId = user._id;
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    }

    await this.User.findByIdAndUpdate(userId, {
      password: await bcrypt.hash(newPassword, Number(process.env.salt)),
    });

    return 'Password changed Successfully';
  }

  async updateUser(
    @UserDec() user: UserModel,
    body: UpdateUserDto,
    image?: Express.Multer.File,
  ): Promise<any> {
    const updation: any = {};

    console.log(body);
    if (body.name) {
      updation.name = body.name;
    }

    if (image) {
      const uploadedImage = await this.uploadService.uploadImage(image);
      console.log(uploadedImage);
      updation.image = uploadedImage.Location;
    }

    if (body.email) {
      const isExist = await this.User.findOne({ email: body.email });
      if (isExist) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      updation.email = body.email;
      updation.isEmailVerified = false;
    }

    if (body.phone) {
      const isExist = await this.User.findOne({ phone: body.phone });
      if (isExist) {
        throw new HttpException('phone already exists', HttpStatus.CONFLICT);
      }
      updation.phone = body.phone;
      updation.isPhoneVerified = false;
    }

    console.log('this is user', user);
    const updatedUser = await this.User.findByIdAndUpdate(user._id, updation, {
      new: true,
    });

    return updatedUser;
  }

  async signout(res: Response) {
    const token = await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1s',
      },
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
    });

    return `user signedout`;
  }

  async deleteUser(@UserDec() user: UserModel) {
    const userId = user._id;

    const deletedUser = await this.User.findByIdAndDelete(userId);

    return `successfully deleted ${deletedUser.name}`;

  }
}
