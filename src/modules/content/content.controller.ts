import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { ContentDto } from './dto/add-content.dto';
import { EditContentDto } from './dto/edit-content.dto';
import { SearchContentDto } from './dto/get-content.dto';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { UserType } from 'src/common/decorators/userType.decorators';
import { Type } from 'src/common/enums/userType.enum';

@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService){}

    @Post() //add content
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async addContent(@Body() body: ContentDto, @UploadedFile() image: Express.Multer.File){
        return this.contentService.addContent(body, image);
    }

    @Post(":id") //edit content
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async editContent(@Param("id") id: string, @Body() body: EditContentDto, @UploadedFile() image: Express.Multer.File){
        return this.contentService.editContent(id, body, image);
    }

    @Get() //get all the contents
    async getContents(@Query() query: SearchContentDto){
        return this.contentService.getContents(query);
    }

    @Get("/:id") //get contents by id
    async getContent(@Param("id") id: string){
        return this.contentService.getContent(id);
    }
}
