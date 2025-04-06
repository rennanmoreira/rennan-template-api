import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { ErrorResponse } from '@dtos/error-response.dto'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const isHttpException = exception instanceof HttpException
    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR.valueOf()

    let exceptionError: any = isHttpException
      ? exception.getResponse()
      : {
          message: exception.message || 'Internal server error',
          stack: exception.stack || null
        }

    console.error('Exception Caught: ', {
      message: exception.message,
      stack: exception.stack,
      path: request.url,
      body: request.body
    })

    if (!isHttpException && process.env.NODE_ENV !== 'production') {
      exceptionError = {
        ...exceptionError,
        stack: exception.stack
      }
    }

    const errorResponse: ErrorResponse = {
      status_code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof exceptionError === 'string' ? exceptionError : exceptionError.message || 'Unknown error',
      error: exceptionError
    }

    response.status(status).json(errorResponse)
  }
}
