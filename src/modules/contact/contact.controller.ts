import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserType } from 'src/common/decorators/userType.decorators';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { Type } from '../../common/enums/userType.enum';
import { AddContactDto } from './dto/add-contact-dto';
import { ContactService } from './contact.service';
import { SearchDto } from './dto/get-contact-dto';
import { updateContactDto } from './dto/update-contact-dto';


@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService){}

    @Post("") //add contact
    async addContact(@Req() req: Request, @Body() body: AddContactDto){
        return this.contactService.addContact(req, body);
    }

    @Get("/:id?") //get contact by id or query or all
    async getContents(@Param("id") id: string, @Query() query: SearchDto){
        return this.contactService.getContacts(id, query);
    }

    @Patch("/:id") //change contact status
    async updateStatus(@Param("id") id: string, @Body() body: updateContactDto){
        return this.contactService.updateStatus(id, body);
    }

    @Delete("/:id") //delete contact by id
    async deleteContact(@Param("id") id: string,){
        return this.contactService.deleteContact(id);
    }
}
