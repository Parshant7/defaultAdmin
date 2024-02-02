import { extname } from "path";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { HttpException, HttpStatus } from "@nestjs/common";
import { v4 as uuid } from 'uuid';

export const multerConfig = {
    dest: process.env.UPLOAD_LOCATION,
};

export const multerOptions = {
    limits: {
        fileSize: 3000000,
    },
    fileFilter: (req: any, file: any, cb: any)=>{
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(null, true);
        }else{
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    }
    
    // storage: diskStorage({
    //     destination: (req: any, file: any, cb: any)=>{
    //         const uploadPath = process.env.UPLOAD_LOCATION;
    //         if(!existsSync(uploadPath)) {
    //             mkdirSync(uploadPath);
    //         }
    //         cb(null, uploadPath)
    //     },
    //     filename: (req:any, file: any, cb:any)=>{
    //         cb(null, `${uuid()}${extname(file.originalname)}`)
    //     }
    // })

    // storage: multerS3()
}
