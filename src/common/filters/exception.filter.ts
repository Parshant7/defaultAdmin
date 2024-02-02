import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const responseObj = exception.getResponse();
        const message = JSON.parse(JSON.stringify(responseObj)).message || responseObj;

        console.log(responseObj);

        response.status(status)
        .json({
            statusCode: status,
            timeStamp: new Date().toISOString,
            path: request.url,
            message: message
        })
    }
}

// @Catch(NotFoundException)
// export class NotFoundExceptionFilter implements ExceptionFilter {
//     catch(_exception: NotFoundException, host: ArgumentsHost){
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse();
//         const request = ctx.getRequest();

//         response.status(404)
//         .json({
//             statusCode: 404,
//             timeStamp: new Date().toISOString,
//             path: request.url,
//             message: "page not found"
//         })
//     }
// }