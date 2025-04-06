import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import * as moment from 'moment-timezone'

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.adjustTimezone(data, new Set())))
  }

  private adjustTimezone(data: any, visited: Set<any>, depth = 0): any {
    if (!data || depth > 5 || visited.has(data)) {
      return data
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.adjustTimezone(item, visited, depth + 1))
    }

    if (typeof data === 'object') {
      for (const key in data) {
        const keySplitted = key.split('_')
        if (
          ['_at', '_to', '_from', '_date'].includes(keySplitted[keySplitted.length - 1]) &&
          data[key] instanceof Date
        ) {
          data[key] = moment.tz(data[key], 'America/Sao_Paulo').format()
        } else if (typeof data[key] === 'object' && data[key] !== null && key !== 'query') {
          try {
            data[key] = this.adjustTimezone(data[key], visited, depth + 1)
          } catch (error) {
            continue
          }
        }
      }
    }
    return data
  }
}
