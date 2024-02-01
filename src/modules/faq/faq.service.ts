import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { FaqModel } from 'src/common/models/faq.model';
import { AddFaqDto } from './dto/add-faq.dto';
import { EditFaqDto } from './dto/edit-faq.dto';
import { SearchFaqDto } from './dto/get-faq.dto';

@Injectable()
export class FaqService {
    constructor(@InjectModel('faqs') private Faq: Model<FaqModel>) {}

    async addFaq(payload: AddFaqDto){
        const faq = {
            question: payload.question,
            answer: payload.answer
        };

        const newfaq = await this.Faq.create(faq);
        return newfaq;
    }

    async editFaq(id: string, payload: EditFaqDto): Promise<FaqModel>{
        if (!isValidObjectId(id)) {
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
        }
        const faqPage = await this.Faq.findById(id);
      
        if (!faqPage) throw new HttpException('Invalid id', HttpStatus.NOT_FOUND);
      
        const updations = {} as any;

        if(payload.question){
            updations.question = payload.question
        }
        if(payload.answer){
            updations.answer = payload.answer
        }
        const updatedPage = await this.Faq.findByIdAndUpdate(id, updations, {new: true});
        return updatedPage;
    }

    async getFaqs(query: SearchFaqDto): Promise<FaqModel[]>{
        console.log('query ', query);
        const filter = {} as any;
        if(query.search){
            filter["$text"] = {
                $search: query.search,
            }
        }
        console.log("filter: ",filter);
    
        const faqPages = await this.Faq.find(filter);
        if(!faqPages)
            throw new HttpException('faqs not found', HttpStatus.NOT_FOUND);
        return faqPages;
    }

    async getFaq(id: string): Promise<FaqModel> {

        console.log('id ', id);
    
        if(!isValidObjectId(id))
            throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST)

        const faqPage = await this.Faq.findById(id);

        if(!faqPage)
            throw new HttpException('faq not found', HttpStatus.NOT_FOUND)
        console.log("faqPage: ",faqPage);
        return faqPage;
      }
}
