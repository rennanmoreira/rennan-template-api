import { Prisma } from '@prisma/client'

export function softDeleteMiddleware() {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    const bypassSoftDelete = params.args?.bypassSoftDelete

    if (bypassSoftDelete) {
      delete params.args.bypassSoftDelete
      return next(params)
    }

    if (['findUnique', 'findFirst', 'findMany', 'findFirstOrThrow', 'findUniqueOrThrow'].includes(params.action)) {
      if (!params.args) {
        params.args = {}
      }
      if (!params.args.where) {
        params.args.where = {}
      }

      params.args.where.deleted_at = null
    }

    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted_at: new Date() }

      // TODO: Test if this is working to softdelete
      await handleCascadeDelete(params, next)
    }

    // TODO: Test if this is working when have many in sublevels
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args['data'] = { deleted_at: new Date() };

      await handleCascadeDelete(params, next);
    }

    return next(params)
  }
}

async function handleCascadeDelete(
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) {
  const model = params.model

  if (!model) {
    return next(params)
  }

  const modelDelegate = (await next(params)) as any

  if (typeof modelDelegate.deleteMany === 'function') {
    await modelDelegate.deleteMany({
      where: {
        ...params.args.where,
        deleted_at: null
      }
    })
  }

  return modelDelegate
}
