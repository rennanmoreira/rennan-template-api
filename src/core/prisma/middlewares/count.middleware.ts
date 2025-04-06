import { Prisma, PrismaClient } from '@prisma/client'

export function countMiddleware(prisma: PrismaClient) {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    if (params.action === 'findMany') {
      const result = await next(params)

      const modelDelegate = prisma[params.model as keyof PrismaClient] as any

      if (typeof modelDelegate.count === 'function') {
        const totalCount = await modelDelegate.count({
          where: {
            ...params.args.where,
            deleted_at: null
          }
        })

        return {
          data: result,
          count: totalCount || 0
        }
      }

      return result
    }

    return next(params)
  }
}
