import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './common/modules/otp/otp.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProductModule } from './modules/product/product.module';
import { ContentModule } from './modules/content/content.module';
import { FaqModule } from './modules/faq/faq.module';
import { ContactModule } from './modules/contact/contact.module';
import { StaffController } from './modules/staff/staff.controller';
import { StaffModule } from './modules/staff/staff.module';
import { NotificationModule } from './modules/notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
// import { NotFoundExceptionFilter } from './common/filters/exception.filter';
import { UploadModule } from './common/modules/upload/upload.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
      }
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UserModule,
    OtpModule,
    ProductModule,
    ContentModule,
    FaqModule,
    ContactModule,
    StaffModule,
    NotificationModule,
    UploadModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
