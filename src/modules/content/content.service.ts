import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ContentModel } from 'src/common/models/content.model';
import { ContentDto } from './dto/add-content.dto';
import { EditContentDto } from './dto/edit-content.dto';
import { SearchContentDto } from './dto/get-content.dto';

@Injectable()
export class ContentService {
    constructor(@InjectModel('contents') private Content: Model<ContentModel>) {}

    async addContent(payload: ContentDto, image: any){
        const content = {
            pageTitle: payload.pageTitle,
            description: payload.description,
            image: image
        };

        const newContent = await this.Content.create(content);
        return newContent;
    }

    async editContent(id: string, payload: EditContentDto, image: any): Promise<ContentModel>{
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }
        const contentPage = await this.Content.findById(id);
      
        if (!contentPage) throw new HttpException('Invalid id', HttpStatus.NOT_FOUND);
      
        const updations = {} as any;

        if(payload.pageTitle){
            updations.pageTitle = payload.pageTitle
        }
        if(payload.description){
            updations.description = payload.description
        }
        if(image){
            updations.image = image;
        }

        const updatedPage = await this.Content.findByIdAndUpdate(id, updations, {new: true});
        return updatedPage;
    }

    async getContents(query: SearchContentDto): Promise<ContentModel[]>{
        console.log('query ', query);
        const filter = {} as any;
        if(query.search){
            filter["$text"] = {
                $search: query.search,
            }
        }
        console.log("filter: ",filter);
    
        const contentPages = await this.Content.find(filter);
        if(!contentPages)
            throw new HttpException('Pages not found', HttpStatus.NOT_FOUND);
        return contentPages;
    }

    async getContent(id: string): Promise<ContentModel> {

        console.log('id ', id);
    
        if(!isValidObjectId(id))
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)

        const contentPage = await this.Content.findById(id);

        if(!contentPage)
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND)
        console.log("contentPage: ",contentPage);
        return contentPage;
      }    
}
