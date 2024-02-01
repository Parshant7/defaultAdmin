import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../enum/notification.enum";

export class NotificationDto{
    @IsArray()
    @IsOptional()
    users: [string];

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsString()
    @IsNotEmpty()
    subject: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

}