import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Type } from 'src/common/enums/userType.enum';
import { UserFilterInterceptor } from 'src/common/interceptors/UserFilter.interceptor';
import { UserModel } from 'src/common/models/user.model';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthorizeUser } from 'src/common/guards/auth.guard';
import { UserType } from 'src/common/decorators/userType.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { RegisterStaffDto } from 'src/modules/auth/dto/register-staff.dto';
import { UpdateStaffDto } from 'src/modules/auth/dto/update-staff.dto';
import { statusDto } from 'src/modules/user/dto/get-status.dto';
import { SearchDto } from 'src/modules/contact/dto/get-contact-dto';
import { UploadService } from 'src/common/modules/upload/upload.service';
// import { catchAsync } from 'src/common/decorators/catchAsync.decorator';


@UseGuards(AuthorizeUser)
@UserType(Type.Admin)
@UseInterceptors(UserFilterInterceptor)
@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly authService: AuthService,
  ) {}

  @Post('') //add staff
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async register(@Body() user: RegisterStaffDto, @UploadedFile() image: Express.Multer.File): Promise<UserModel> {
      return await this.authService.register(user, Type.Staff, image);
  }

  @Patch('/:id') // update staff by id
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateStaff(@Param("id") id: string, @Body() body: UpdateStaffDto, @UploadedFile() image: Express.Multer.File): Promise<UserModel> {
      return await this.staffService.updateStaff(id, body, image);
  }

  @Patch('/update_status/:id') //update status by id
  async updateStatus(@Param("id") id: string, @Body() body: statusDto): Promise<UserModel> {
      return await this.staffService.updateStatus(id, body);
  }

  @Get("/:id?") //get user by id/search
  @UseGuards(AuthorizeUser)
  @UserType(Type.Admin)
  async getStaff(@Param("id") id: string, @Query() query: SearchDto){
      return await this.staffService.getStaff(id, query);
  }
}
