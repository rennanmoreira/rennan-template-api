import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ErrorHandlingMiddleware } from './middlewares/error-handling.middleware'
import { AuthGuardProvider } from '@core/auth/auth.guard'
import { AuthModule } from '@core/auth/auth.module'
import { PrismaModule } from '@core/prisma/prisma.module'
import { FirebaseModule } from '@core/firebase/firebase.module'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    FirebaseModule,

    // Database modules
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuardProvider]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*')
  }
}
