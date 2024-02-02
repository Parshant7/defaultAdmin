import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
  ],
  providers: [UploadService],
  exports: [UploadService]
})

export class UploadModule {}
