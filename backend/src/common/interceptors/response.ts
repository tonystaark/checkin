// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


//Not in used
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('Raw response data:', data);
        return {
          success: true,
          data: Object.keys(data).length === 0 ? [] : data,
          message: Object.keys(data).length === 0
            ? 'No data found'
            : 'Request successful',
        }

      }),
    );
  }
}