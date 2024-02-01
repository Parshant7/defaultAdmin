import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { UserModel } from 'src/common/models/user.model';
import { NotificationDto } from './dto/notification.dto';
import { NotificationType } from './enum/notification.enum';
import { MessageService } from 'src/common/modules/otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import _ from "underscore";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    private readonly mailerService: MailerService,
    private readonly messageService: MessageService,
  ) {}

  async sendNotification(body: NotificationDto) {
    try {
      const users = body.users;
      const subject = body.subject;
      const description = body.description;
      const notificationMethod = body.type;
      let filteredUsers: any;
      let invalidIds: any;
  
      //checking if users are specified by the admin
      if (body.users) {
  
        const [invalidContacts, filteredIds] = await this.validateUsersId(users, notificationMethod);
        filteredUsers = filteredIds;
        invalidIds = invalidContacts;
  
      } else { // getting all the users
        filteredUsers = await this.getAllContacts(notificationMethod);
      }
  
      // send email
      if (notificationMethod === NotificationType.EMAIL) {
        
        filteredUsers.forEach(async (email:string) => {
          try {
            await this.messageService.sendEmail(email, subject, description);
          } catch (error) {
            console.log("this is the error", error);
            throw new BadRequestException();
          }
        });
      }
      else{// send sms
        console.log(" this is filtered user ",filteredUsers);
        
        filteredUsers.forEach(async (phone: string) => {
          await this.messageService.sendSMS(phone, subject+description);
        });
      }
  
      if(invalidIds && invalidIds.length){ //if there exists any invalid ids
        throw new HttpException(`Could not sent ${notificationMethod} to these users ${invalidIds}`,HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      console.log("this is the error", error);
      throw new HttpException("error occured while sending emails", HttpStatus.BAD_REQUEST);
    }
  }

  //gives list of phone number or emails based on the notification method
  async getAllContacts(notificationMethod: NotificationType) {
    const users = await this.User.find(); //can add condition like if message should be sent to admin or not

    const filteredContacts = [];

    if(notificationMethod === NotificationType.EMAIL){
      // storing only the emails
        users.forEach(object => {
        if(object.email !== undefined){
          filteredContacts.push(object.email)
        }
          return object.email;
      });
    }
    else { // storing only the emails
      users.forEach(object => {
        if(object.phone !== undefined){
          filteredContacts.push(object.phone);
        } 
      });
    }
    console.log("this is the filteredContacts ", filteredContacts);
    return filteredContacts;
  }

  // gives the phone/email and also returns the invalid ids
  async validateUsersId(ids: [string], notificationType: NotificationType): Promise<Array<any>> {
   const invalidIds: string[] = [];
   const contacts = [];
   await ids.map(async (id) => {

        if(!isValidObjectId(id)){ // if not valid id 
          console.log("this is invalid contact id ", id);
          invalidIds.push();
        }
        else{
          const user = await this.User.findById(id);
          console.log("this is user", user)
          const userObject = JSON.parse(JSON.stringify(user));
          if (userObject){
            if(notificationType === NotificationType.EMAIL){ // send emails
                if(userObject.email){
                  contacts.push(userObject.email);
                }else{
                  invalidIds.push(userObject._id);
                }
              }
            else if(notificationType === NotificationType.SMS){ // send sms
                if(userObject.phone){
                  contacts.push(userObject.phone);
                }else{
                  invalidIds.push(userObject._id);
                }
            }
          }
      }
    })

    console.log("these are the contacts ",contacts);
    Promise.all(contacts)
    .then((contact)=>{
      console.log("these are the contacts ", contact);
    })
    const invalidContacts = _.uniq(invalidIds);
    const filteredIds = _.uniq(contacts);
    return [invalidContacts, filteredIds];
  }
}
