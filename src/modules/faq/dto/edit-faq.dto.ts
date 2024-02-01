import { PartialType } from "@nestjs/mapped-types";
import { AddFaqDto } from "./add-faq.dto";

export class EditFaqDto extends PartialType(AddFaqDto){}