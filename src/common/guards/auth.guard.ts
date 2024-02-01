import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reflector } from '@nestjs/core';
import { Type as UserType } from '../enums/userType.enum';
import { Role as RoleType } from '../enums/role.enum';
import { TYPES_KEY } from '../decorators/userType.decorators';
import { ROLES_KEY } from '../decorators/role.decorators';

@Injectable()
export class AuthorizeUser implements CanActivate {
  constructor(
    @InjectModel('users') private User: Model<UserModel>,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(TYPES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    
    console.log("required types ", requiredTypes);
    console.log("required roles ", requiredRoles);
    

    const request = context.switchToHttp().getRequest();
    
    // const token = this.extractTokenFromHeader(request);
    const token = request.cookies["access_token"];
    
    if (!token) throw new UnauthorizedException();
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.secret,
      });

      console.log("payload received ", payload);
      const user = await this.User.findById(payload._id);
      console.log("authorize user", user);
      
      //checking if user exists in the database;
      if (!user) {
        throw new UnauthorizedException();
      }
      
      user.tokenType = payload.tokenType;
      request.user = user;
            
      // if API does not required any role
      if (!requiredRoles && !requiredTypes){
        return true;
      }

      // if user satisfy the type
      if(requiredTypes?.length && !requiredTypes.some((type)=> user.type === type))
      {
        console.log("user does not satisfy the type");
        throw new UnauthorizedException();
      }

      // if user satisfy the role
      if(requiredRoles?.length && !requiredRoles.some((role)=> user.roles.includes(role)))
      {
        console.log("user does not satisfy the role");
        throw new UnauthorizedException();
      }

    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

