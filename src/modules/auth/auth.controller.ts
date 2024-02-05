import { Body, Controller, Get, Post, UseGuards, Put, Patch, Param, Response, UseInterceptors, Req, UploadedFile, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthorizeUser } from '../../common/guards/auth.guard';
import { UserModel } from "../../common/models/user.model";
import { RegisterUserDto } from './dto/registeration.dto';
import { LoginUserDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {updateUserStatusBody, updateUserStatusParams} from './dto/update-status.dto';
import { Response as ResponseExpress, Request } from 'express';
import { UserFilterInterceptor } from '../../common/interceptors/UserFilter.interceptor';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Type } from '../../common/enums/userType.enum';
import { User } from '../../common/decorators/user.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("/register")
    @UseInterceptors(UserFilterInterceptor)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async register(@Body() user: RegisterUserDto, @UploadedFile() image: Express.Multer.File):Promise<UserModel>{
        return this.authService.register(user, Type.User, image);
    }

    @Post("/register_admin")
    @UseInterceptors(UserFilterInterceptor)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async registerAdmin(@Body() user: RegisterUserDto, image: Express.Multer.File):Promise<UserModel>{
      return this.authService.register(user, Type.Admin, image);
    }

    @Post("/login")
    async login(@Response({passthrough: true}) res: ResponseExpress, @Body() user: LoginUserDto): Promise<UserModel>{
      return this.authService.login(res, user);
    }

    @UseGuards(AuthorizeUser)
    @Put("/send_email_otp")
    async sendEmailOtp(@Req() req: Request){
      return this.authService.sendEmailOtp(req);
    }


    @UseGuards(AuthorizeUser)
    @Put("/verify_email_otp")
    async verifyEmailOtp(@Req() req: Request, @Body() body: VerifyOtpDto){
      return this.authService.verifyEmailOtp(req, body);
    }

    @UseGuards(AuthorizeUser)
    @Put("/send_phone_otp")
    async sendPhoneOtp(@Req() req: Request){
      return this.authService.sendPhoneOtp(req);
    }

    @UseGuards(AuthorizeUser)
    @Put("/verify_phone_otp")
    async verifyPhoneOtp(@Req() req: Request, @Body() body: VerifyOtpDto){
      return this.authService.verifyPhoneOtp(req, body);
    }
    
    @Patch('/forgot_password')
    async forgotPassword(@Response({passthrough: true}) res: ResponseExpress, @Body() body: ForgotPasswordDto) {
      return this.authService.forgotPassword(res, body);
    }

    @UseGuards(AuthorizeUser)
    @Patch('/reset_password')
    async resetPassword(@User() user: UserModel, @Body() body: ResetPasswordDto) {
      return this.authService.resetPassword(user, body);
    }
    
    @UseGuards(AuthorizeUser)
    @Patch('/change_password')
    async changePassword(@User() user: UserModel, @Body() body: ChangePasswordDto) {
      return this.authService.changePassword(user, body);
    }

    @UseGuards(AuthorizeUser)
    @UseInterceptors(UserFilterInterceptor)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    @Patch('/update_user')
    async updateUser(@User() user: UserModel, @Body() body: UpdateUserDto, @UploadedFile() image: Express.Multer.File) {
      return this.authService.updateUser(user, body, image);
    }

    @UseGuards(AuthorizeUser)
    @Delete('/')
    async deleteUser(@User() user: UserModel) {
        return this.authService.deleteUser(user);
    }

    @UseGuards(AuthorizeUser)
    @Post('/signout')
    async signout(@Response({passthrough: true}) res: ResponseExpress) {
        return this.authService.signout(res);
    }

}