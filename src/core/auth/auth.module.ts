import { Module } from '@nestjs/common'
import { AccountModule } from '@accounts/account.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { FirebaseModule } from '../firebase/firebase.module'

@Module({
  imports: [AccountModule, FirebaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
