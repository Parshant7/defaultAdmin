import { IsNotEmpty, IsString} from 'class-validator';

export class AddFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;
 
  @IsString()
  @IsNotEmpty()
  answer: string;
}
