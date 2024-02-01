import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import _, { filter } from "underscore";

@Injectable()
export class UserFilterInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
        return next.handle().pipe(map(payload=>{
            const data = JSON.parse(JSON.stringify(payload));

            if(data instanceof Array){
                console.log(" data is the instance of array");
                
                const filteredData = [];
                data.map( async obj =>{
                    filteredData.push(_.omit(obj,"password","__v"));
                })
                return filteredData;
            }

            return  _.omit(data,"password","__v");
        }))
    }
}
