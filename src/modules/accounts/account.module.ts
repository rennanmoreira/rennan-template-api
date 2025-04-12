import { Module } from '@nestjs/common'
import { AccountController } from '@accounts/account.controller'
import { AccountRepository } from '@accounts/account.repository'
import { AccountService } from '@accounts/account.service'

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService]
})
export class AccountModule {}
