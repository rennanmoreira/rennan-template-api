import { Prisma, Account } from '@prisma/client'

export function clearMiddleware() {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    if (params.action === 'findMany') {
      const result = await next(params)

      // TODO: Implementar caso seja necessário ocultar campos sensíveis do usuário ou de qualquer outro model
      // if (params.model === '' && result) {
      //   return result.data.map((user: Account) => {
      //     delete user.refresh_token
      //     delete user.password
      //     return user
      //   })
      // }

      return result
    }

    return next(params)
  }
}
