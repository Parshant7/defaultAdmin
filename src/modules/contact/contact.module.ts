import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './schemas/contact.schema';
import { UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    MongooseModule.forFeature([{ name: "contacts", schema: ContactSchema }, { name: "users", schema: UserSchema }])
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports:  [ContactService]
})
export class ContactModule {}

