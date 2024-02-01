import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'pk@gmail.com',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    status: string;
}
