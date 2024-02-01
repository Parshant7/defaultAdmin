import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class imageInterceptor{
    
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
        return next.handle().pipe(map(payload=>{
            console.log("data in interceptor", payload);
            const data = {
                name: payload.name,
                email: payload.email, 
                type: payload.type, 
                status: payload.status
            };
            return data;
        }))
    }
}