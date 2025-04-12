import { Module } from '@nestjs/common'
import { AccountEventController } from '@account-events/account-event.controller'
import { AccountEventRepository } from '@account-events/account-event.repository'
import { AccountEventService } from '@account-events/account-event.service'

@Module({
  imports: [],
  controllers: [AccountEventController],
  providers: [AccountEventService, AccountEventRepository],
  exports: [AccountEventService]
})
export class AccountEventModule {}
