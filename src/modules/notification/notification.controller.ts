import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dto/notification.dto';
import { UserType } from 'src/common/decorators/userType.decorators';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { Type } from 'src/common/enums/userType.enum';

@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(@Body() body: NotificationDto){
    return await this.notificationService.sendNotification(body);
  }
}
