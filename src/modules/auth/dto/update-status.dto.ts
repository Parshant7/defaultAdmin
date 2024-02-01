import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, ValidateIf, validate, IsNotEmpty, ValidatorConstraintInterface, ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class updateUserStatusBody {
  @IsEnum(["DEACTIVE", "BLOCK", "ACTIVE", "UNBLOCK"],{message: "invalid value for the status"})
  @ApiProperty({
    example: 'UNBLOCK',
    required: true
  })
  status: string;
}

export class updateUserStatusParams {
  @ValidateIf((o) => {
    console.log('this is dto', o);
    if(!Types.ObjectId.isValid(o._id.toString())){
      throw new BadRequestException("Invalid id");
    }
    return true;
  })
  @IsNotEmpty()
  _id: string;
}

