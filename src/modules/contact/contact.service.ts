import { Body, HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, isValidObjectId } from 'mongoose';
import { ContactModel } from 'src/common/models/contact.model';
import { AddContactDto } from './dto/add-contact-dto';
import { SearchDto } from './dto/get-contact-dto';
import _ from "underscore";
import { updateContactDto } from './dto/update-contact-dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel('contacts') private Contact: Model<ContactModel>,
    ){}

    async addContact(@Req() req: Request, @Body() body: AddContactDto): Promise<ContactModel>{
        const user = req.user;
        const payload = {
            user: user._id,
            message: body.message
        };

        const newContact = await this.Contact.create(payload);
        return newContact;
    }

    async getContacts(id: string, query: SearchDto): Promise<ContactModel[]>{
        
        let contacts:ContactModel[] = [];
        
        //search by param
        if(id && isValidObjectId(id)){
            const contact = await this.Contact.findById(id).populate("user");
            contacts.push(contact);
        }
        //search by query
        else{
            const filter = {} as any;
            if(query.search){
                filter["$text"] = {
                    $search: query.search,
                }
            }
            console.log("filter: ",filter);
            contacts = await this.Contact.find(filter).populate("user");
        }

        console.log(contacts);

        //if contacts not found
        if(!contacts && contacts.length)
            throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

        const filteredContact = this.filterContact(contacts);

        return filteredContact;
    }

    async updateStatus( id: string, @Body() body: updateContactDto){
        //check if id is correct
        const status = body.status;

        if(!isValidObjectId(id)){
            throw new HttpException(`invalid id`, HttpStatus.BAD_REQUEST);
        }

        const contact = await this.Contact.findById(id);
        if(!contact){
            throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }

        const updatedContact = await this.Contact.findByIdAndUpdate(id, {status: status}, {new: true}).populate("user");
        const filteredContact = this.filterContact([updatedContact]);
        return filteredContact;
    }


    async deleteContact(id: string): Promise<ContactModel>{
        if(!isValidObjectId(id)){
            throw new HttpException(`invalid id`, HttpStatus.BAD_REQUEST);
        }

        const contact = await this.Contact.findByIdAndDelete(id).populate("user");
        console.log(contact);
        if(!contact){
            throw new HttpException(`No contact found`, HttpStatus.NOT_FOUND);
        }
        
        const filteredContact = this.filterContact([contact]);
        console.log("this is filtered contact array", filteredContact);
        console.log("this is filtered contact", filteredContact[0]);

        return filteredContact[0];
    }

    filterContact(contacts: ContactModel[]) : ContactModel[]{
        const contactsObjects = JSON.parse(JSON.stringify(contacts));

        const contactsFiltered = contactsObjects.map(((obj: ContactModel) =>{
            obj.user = _.omit(obj.user, 'password', 'isEmailVerified', 'isPhoneVerified', "__v");
            return obj;
        }));

        return contactsFiltered;
    } 
}
