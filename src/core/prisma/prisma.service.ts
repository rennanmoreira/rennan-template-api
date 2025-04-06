import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { countMiddleware } from './middlewares/count.middleware'
import { softDeleteMiddleware } from './middlewares/softdelete.middleware'
import { clearMiddleware } from './middlewares/clear.middleware'
import { CustomLogger, DEFAULT_COLOR } from '@utils/custom-logger'
import { IS_PRODUCTION } from '@helpers/environment.helper'

const PRISMA_LOGS_TO_IGNORE = ['BEGIN', 'COMMIT', 'SELECT 1']
const PRISMA_EVENTS = ['warn', 'error'] // 'info', 'query'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = IS_PRODUCTION ? new Logger(PrismaService.name) : new CustomLogger(PrismaService.name)

  constructor() {
    super({
      log: [
        ...PRISMA_EVENTS.map((level) => ({
          emit: 'event' as 'event',
          level: level as Prisma.LogLevel
        }))
      ]
    })

    // Apply middlewares TODO: Deprecated in Prisma v4
    this.$use(softDeleteMiddleware())
    this.$use(clearMiddleware())
    this.$use(countMiddleware(this))

    this.$on('info' as never, (e: any) => {
      this.logger.log('[INFO] ' + e.message)
    })

    this.$on('query' as never, (e: any) => {
      if (PRISMA_LOGS_TO_IGNORE.includes(e?.query)) return
      const message = `[QUERY] ${e?.query?.replaceAll(/"rennan-api"./g, '')}`

      if (IS_PRODUCTION) {
        this.logger.log(message)
      } else {
        this.logger.log(message, DEFAULT_COLOR)
      }
    })

    this.$on('error' as never, (e: any) => {
      this.logger.error('[ERROR] ' + e?.message)
    })

    this.$on('warn' as never, (e: any) => {
      this.logger.warn('[WARN] ' + e?.message)
    })

    // this.$use(async (params, next) => {
    //   if (String(params.model) === 'Post') {
    //     if (params.action === 'findUnique' || params.action === 'findFirst') {
    //       // Change to findFirst - you cannot filter
    //       // by anything except ID / unique with findUnique()
    //       params.action = 'findFirst'
    //       // Add 'deleted' filter
    //       // ID filter maintained
    //       params.args.where['deleted'] = false
    //     }
    //     if (params.action === 'findFirstOrThrow' || params.action === 'findUniqueOrThrow') {
    //       if (params.args.where) {
    //         if (params.args.where.deleted == undefined) {
    //           // Exclude deleted records if they have not been explicitly requested
    //           params.args.where['deleted'] = false
    //         }
    //       } else {
    //         params.args['where'] = { deleted: false }
    //       }
    //     }
    //     if (params.action === 'findMany') {
    //       // Find many queries
    //       if (params.args.where) {
    //         if (params.args.where.deleted == undefined) {
    //           params.args.where['deleted'] = false
    //         }
    //       } else {
    //         params.args['where'] = { deleted: false }
    //       }
    //     }
    //   }
    //   return next(params)
    // })

    // this.$use(async (params, next) => {
    //   if (String(params.model) == 'Post') {
    //     if (params.action == 'update') {
    //       // Change to updateMany - you cannot filter
    //       // by anything except ID / unique with findUnique()
    //       params.action = 'updateMany'
    //       // Add 'deleted' filter
    //       // ID filter maintained
    //       params.args.where['deleted'] = false
    //     }
    //     if (params.action == 'updateMany') {
    //       if (params.args.where != undefined) {
    //         params.args.where['deleted'] = false
    //       } else {
    //         params.args['where'] = { deleted: false }
    //       }
    //     }
    //   }
    //   return next(params)
    // })

    // this.$use(async (params, next) => {
    //   // Check incoming query type
    //   if (String(params.model) == 'Post') {
    //     if (params.action == 'delete') {
    //       // Delete queries
    //       // Change action to an update
    //       params.action = 'update'
    //       params.args['data'] = { deleted_at: true }
    //     }
    //     if (params.action == 'deleteMany') {
    //       // Delete many queries
    //       params.action = 'updateMany'
    //       if (params.args.data != undefined) {
    //         params.args.data['deleted'] = true
    //       } else {
    //         params.args['data'] = { deleted_at: true }
    //       }
    //     }
    //   }
    //   return next(params)
    // })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    // app.enableShutdownHooks()
    process.on('beforeExit', async () => {
      await app.close()
    })

    // eslint-disable-next-line @typescript-eslint/naming-convention
    app.use((_req, _res, next) => {
      if (!this.$disconnect) {
        return next()
      }

      const cleanup = async () => {
        await this.$disconnect()
      }

      process.on('SIGINT', cleanup)
      process.on('SIGTERM', cleanup)
      next()
    })
  }
}
