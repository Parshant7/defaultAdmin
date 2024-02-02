import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Type } from 'src/common/enums/userType.enum';
import { UserModel } from 'src/common/models/user.model';
import { UpdateStaffDto } from 'src/modules/auth/dto/update-staff.dto';
import { statusDto } from 'src/modules/user/dto/get-status.dto';
import { SearchDto } from './dto/get-staff-dto';
import _ from "underscore";
import { UploadService } from 'src/common/modules/upload/upload.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    private readonly uploadService: UploadService
    ) {}

    async updateStaff(id: string, body: UpdateStaffDto, image?: any
    ): Promise<any> {

      //check if id is valid
      if(!isValidObjectId(id))
         throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST); 

      //check if user exists with the id
      const user = await this.User.findById(id);
      // if user does not exists or its type is not staff
      if(!user || user.type !== Type.Staff)
          throw new HttpException('Staff not found', HttpStatus.NOT_FOUND); 

      //updating staff/user
      const updation: any = {};

      console.log(body);

      if(body.name) updation.name = body.name;
      if(body.roles) updation.roles = body.roles;
      //validating email
      if(body.email){
        const isExist = await this.User.findOne({email: body.email});
        if(isExist){
          throw new HttpException('Email already exists', HttpStatus.CONFLICT); 
        }
        updation.email = body.email;
        updation.isEmailVerified = false;
      }
  
      //validating phone number 
      if(body.phone){
        const isExist = await this.User.findOne({phone: body.phone});
        if(isExist){
          throw new HttpException('phone already exists', HttpStatus.CONFLICT); 
        }
        updation.phone = body.phone;
        updation.isPhoneVerified = false;
      }

      //adding profile image
      if(image){
          const uploadedImage = await this.uploadService.uploadImage(image);
          console.log(uploadedImage);
          updation.image = uploadedImage.Location;
      }

      console.log('this is staff', user);
      const updatedStaff = await this.User.findByIdAndUpdate(user._id, updation, {new: true});    
  
      return updatedStaff;
    }

  async updateStatus(id: string, body: statusDto): Promise<UserModel> {
      console.log('param ', id, "body ", body);

      if (!isValidObjectId(id))  
          throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)

      const user = await this.User.findOneAndUpdate({_id: id, type: Type.Staff}, {status: body.status}, {new: true});
      
      if(!user || user.type!==Type.Staff)
        throw new HttpException('Staff does not exist', HttpStatus.NOT_FOUND); 
      
      return user;
  }

  async getStaff(id: string, query: SearchDto): Promise<UserModel[]>{
        
    let staff:UserModel[] = [];
    
    //search by param
    if(id){
        if(!isValidObjectId(id)){
          throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)
        }
        const user = await this.User.findOne({_id: id, type: Type.Staff});
        if(!user){
          throw new HttpException('staff not found', HttpStatus.NOT_FOUND); 
        }
        staff.push(user);
    }
    //search by query
    else{
        const filter = {
          type: Type.Staff
        } as any;
        if(query.search){
            filter["$text"] = {
                $search: query.search,
            }
        }
        console.log("filter: ",filter);
        staff = await this.User.find(filter);
    }

    console.log("staff : ",staff);


    //if contacts not found
    if(!staff || !staff.length)
        throw new HttpException('staff not found', HttpStatus.NOT_FOUND);

    const filteredContact = this.filterContact(staff);
    console.log("filtered staff ", filteredContact);
    return filteredContact;
  }


  filterContact(staff: UserModel[]) : UserModel[]{
    const staffObjects = JSON.parse(JSON.stringify(staff));
    console.log(staffObjects);
    const contactsFiltered = staffObjects.map(((obj: any) =>{
        obj = _.omit(obj, 'password', 'isEmailVerified', 'isPhoneVerified', "__v");
        return obj;
    }));

    return contactsFiltered;
  } 

}
