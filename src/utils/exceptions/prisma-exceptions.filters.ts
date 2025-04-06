import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest<Request>()

    switch (exception.code) {
      case 'P2002':
        this.handleConflictError(exception, response, request, 'P2002')
        break
      case 'P2014':
        this.handleConflictError(exception, response, request, 'P2014')
        break
      case 'P2025':
        this.handleNotFoundError(exception, response, request, 'P2025')
        break
      default:
        throw exception
    }
  }

  private handleConflictError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: any,
    request: Request,
    code: string
  ): void {
    const targetFields = exception.meta?.target as string[] | undefined
    const fieldNames = Array.isArray(targetFields) ? targetFields.join(', ') : targetFields

    let message = ''

    switch (code) {
      case 'P2002':
        message = `O valor para o(s) campo(s) ${fieldNames} já está em uso. Por favor, escolha outro(s).`
        break
      case 'P2014':
        message = `Já existe um relacionamento de ${exception.meta.relation_name} com os dados fornecidos.`
        break
      default:
        message = 'Erro ao processar a requisição. Por favor, tente novamente.'
        break
    }

    response.status(HttpStatus.CONFLICT).json({
      statusCode: HttpStatus.CONFLICT,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message
    })
  }

  private handleNotFoundError(
    exception: Prisma.PrismaClientKnownRequestError,
    response: any,
    request: Request,
    code: string
  ) {
    const { modelName, cause } = exception.meta
    const message = `Record not found for ${modelName} entity${cause ? ': ' + cause : ''}`

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: code,
      error: message
    })
  }
}
