import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { AddFaqDto } from './dto/add-faq.dto';
import { EditFaqDto } from './dto/edit-faq.dto';
import { SearchFaqDto } from './dto/get-faq.dto';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { UserType } from 'src/common/decorators/userType.decorators';
import { Type } from 'src/common/enums/userType.enum';

@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post('') //add faq
  async addFaq(@Body() body: AddFaqDto) {
    return this.faqService.addFaq(body);
  }

  @Patch(':id') //edit faq by id
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async editFaq(@Param('id') id: string, @Body() body: EditFaqDto) {
      return this.faqService.editFaq(id, body);
  }

  @Get() // get faqs
  async getFaqs(@Query() query: SearchFaqDto) {
      return this.faqService.getFaqs(query);
  }

  @Get('/:id') //get faq by id
  async getFaq(@Param('id') id: string) {
      return this.faqService.getFaq(id);
  }
}
