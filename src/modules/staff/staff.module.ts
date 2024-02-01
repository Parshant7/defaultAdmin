import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/modules/auth/schemas/user.schema';
import { AuthModule } from 'src/modules/auth/auth.module';
import { StaffController } from './staff.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    AuthModule
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService]
})

export class StaffModule {}
