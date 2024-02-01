import { PartialType } from "@nestjs/mapped-types";
import { ContentDto } from "./add-content.dto";

export class EditContentDto extends PartialType(ContentDto){}