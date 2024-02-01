import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './dto/add-user.dto';
import { UserFilterInterceptor } from 'src/common/interceptors/UserFilter.interceptor';
import { statusDto } from './dto/get-status.dto';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { UserType } from 'src/common/decorators/userType.decorators';
import { Type } from 'src/common/enums/userType.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';


@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@UseInterceptors(UserFilterInterceptor)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post("") //add users
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async addUser(@Body() body: AddUserDto,  @UploadedFile() image: Express.Multer.File){
        return await this.userService.addUser(body, image);
    }

    @Get("/:id") //get specific user
    async getUser(@Param("id") id: string){
        return await this.userService.getUser(id);
    }

    @Get("") //get all users / by search
    async getUsers(@Query() query: statusDto){
        return await this.userService.getUsers(query);
    }
   
    @Patch("/:id") //update user status
    async updateUser(@Param("id") id: string, @Body() body: statusDto){
        return await this.userService.updateUser(id, body);
    }
}
