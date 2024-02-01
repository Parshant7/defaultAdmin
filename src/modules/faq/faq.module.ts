import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { FaqSchema } from './schemas/faq.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: "faqs", schema: FaqSchema }, { name: "users", schema: UserSchema }]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
  ],
  controllers: [FaqController],
  providers: [FaqService]
})
export class FaqModule {}
