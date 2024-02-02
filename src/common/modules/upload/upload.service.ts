import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {

    AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    
    s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    async uploadImage(file){
        console.log(file);
        const { originalname } = file;
        
        return await this.s3_upload(
            file.buffer,
            this.AWS_S3_BUCKET,
            `${uuid()}${extname(originalname)}`,
            file.mimetype,
        );
    }

    async s3_upload(file, bucket, name, mimetype){
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };

        try {
            const s3Response = await this.s3.upload(params).promise();
            console.log(s3Response);
            return s3Response;            
        } catch (error) {
            console.log(error);
            return error;            
        }
    }
}
