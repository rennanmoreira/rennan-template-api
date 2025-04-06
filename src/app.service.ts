import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  healthcheck(): { status: string } {
    return { status: 'OK' }
  }

  async healthcheckDatabase(): Promise<{ status: string; message: string }> {
    try {
      const migrations: Array<Record<string, any>> = await this.prisma.$queryRaw`SELECT * FROM _prisma_migrations`
      return {
        status: 'OK',
        message: `Connection to database is OK - ${migrations.length} migrations found!`
      }
    } catch {
      throw new InternalServerErrorException('Error: something went wrong on connection to database')
    }
  }
}
