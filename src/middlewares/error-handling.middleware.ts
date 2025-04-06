import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express' // TODO: Test if this makes senses let the express here

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      next()
    } catch (err) {
      if (err instanceof HttpException) {
        res.status(err.getStatus()).json({
          statusCode: err.getStatus(),
          message: err.message
        })
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error'
        })
      }
    }
  }
}
