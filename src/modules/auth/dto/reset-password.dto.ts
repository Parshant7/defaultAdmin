
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
   
    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @MinLength(8, { message: 'New Password must be at least 8 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, {
      message: 'New Password must contain at least one letter and one number',
    })
    newPassword: string;

}
