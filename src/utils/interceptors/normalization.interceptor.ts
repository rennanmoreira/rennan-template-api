import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { normalizePeople } from '@helpers/normalizes.helper'

@Injectable()
export class NormalizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    if (['POST', 'PUT'].includes(request.method)) {
      request.body = normalizePeople(request.body)

      // Adicione outras normalizações aqui
    }

    return next.handle().pipe(
      map((data) => {
        return data
      })
    )
  }
}
