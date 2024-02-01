import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../../modules/auth/schemas/user.schema';
import { OtpSchema } from '../../../modules/auth/schemas/otp.schema';
import { OtpService, MessageService } from "./otp.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),
    MongooseModule.forFeature([{ name: "otps", schema: OtpSchema }]),

    JwtModule.register({
      global: true,
      secret: process.env.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
  ],
  providers: [OtpService, MessageService],
  exports: [OtpService, MessageService],
})

export class OtpModule {}
