import { HttpException, HttpStatus, Injectable, Param, Query } from '@nestjs/common';
import { AddUserDto } from './dto/add-user.dto';
import { Model, Types } from 'mongoose';
import { UserModel } from 'src/common/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Type as UserType } from '../../common/enums/userType.enum';
import { Status as StatusType } from '../../common/enums/status.enum';
import { statusDto } from './dto/get-status.dto';
import { idDto } from './dto/user-id.dto';
import { UploadService } from 'src/common/modules/upload/upload.service';


@Injectable()
export class UserService {
    constructor(
        @InjectModel('users') private User: Model<UserModel>,
        private readonly uploadService: UploadService
    ){}
    
    async addUser(payload: AddUserDto, image: any) {
        const isExists = !!(await this.User.findOne({ email: payload.email }));

        //if email already exists
        if (isExists) {
            throw new HttpException(
                `Email '${payload.email}' already exists.`,
                HttpStatus.CONFLICT,
            );
        }

        payload.password = await bcrypt.hash(payload.password, Number(process.env.salt));
        
        const newUser:any = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            role: UserType.User,
        };

        if(image){
            const uploadedImage = await this.uploadService.uploadImage(image);
            console.log(uploadedImage);
            newUser.image = uploadedImage.Location;
        }

        const createdUser = await this.User.create(newUser);
        // await this.sendOtp(createdUser.email, OtpType.emailverification);
        return createdUser;
    }

    async getUser(id: string): Promise<UserModel> {

        console.log('param ', id);
        if (!Types.ObjectId.isValid(id)){
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST); 
        }
        const user = await this.User.findById(id);

        if(!user) throw new HttpException('Invalid id', HttpStatus.NOT_FOUND);

        return user;
    }

    async getUsers(@Query() query: statusDto): Promise<UserModel[]> {

        let users = [];
        console.log('query ', query);
        if (!query.status) {
        users = await this.User.find(
            { role: UserType.User },
            '_id name email role status',
        );
        } else {
            users = await this.User.find(
                { role: UserType.User, status: query.status },
                '_id name email role status',
            );
        }
        return users;
    }

    async updateUser(id: string, body: statusDto): Promise<UserModel> {
        console.log('param ', id, "body ", body);

        if (!Types.ObjectId.isValid(id))  
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)

        const user = await this.User.findByIdAndUpdate(id, {status: body.status}, {new: true});

        if(!user)
            throw new HttpException('Invalid id', HttpStatus.NOT_FOUND); 

        return user;
    }

}
