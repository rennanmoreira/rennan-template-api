import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { Public } from './decorators/public.decorator'

@ApiTags('API Status')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/healthcheck')
  @Public()
  getHealthcheck(): { status: string } {
    return this.appService.healthcheck()
  }

  @Get('/healthcheck-database')
  @Public()
  async getHealthcheckDatabase(): Promise<{ status: string; message: string }> {
    return await this.appService.healthcheckDatabase()
  }
}
