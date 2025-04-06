/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client'
import { PrismaModels } from 'prisma-models'

declare module '@prisma/client' {
  namespace Prisma {
    interface PrismaPromise<T> extends Promise<T> {}
  }
}

export type Models = PrismaModels<Prisma.ModelName, Prisma.TypeMap>
