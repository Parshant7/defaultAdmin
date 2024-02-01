import { SetMetadata } from '@nestjs/common';
import { Type } from '../enums/userType.enum';

export const TYPES_KEY = 'userTypes';
export const UserType = (...types: Type[]) => SetMetadata(TYPES_KEY, types);