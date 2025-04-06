import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ErrorHandlingMiddleware } from './middlewares/error-handling.middleware'
import { AuthGuardProvider } from '@core/auth/auth.guard'
import { AuthModule } from '@core/auth/auth.module'
import { PrismaModule } from '@core/prisma/prisma.module'
import { FirebaseModule } from '@core/firebase/firebase.module'
import { AccountModule } from './modules/accounts/account.module'
import { AccountEventModule } from './modules/account-events/account-event.module'
import { ActivityModule } from './modules/activities/activity.module'
import { AssessmentModule } from './modules/assessments/assessment.module'
import { NoteModule } from './modules/notes/note.module'
import { PatientPillarModule } from './modules/patient-pillars/patient-pillar.module'
import { PatientResponsibleModule } from './modules/patient-responsibles/patient-responsible.module'
import { PatientTherapistModule } from './modules/patient-therapists/patient-therapist.module'
import { PatientModule } from './modules/patients/patient.module'
import { PillarModule } from './modules/pillars/pillar.module'
import { ResourceModule } from './modules/resources/resource.module'
import { ResponsibleModule } from './modules/responsibles/responsible.module'
import { TherapistModule } from './modules/therapists/therapist.module'
import { WorkingDayModule } from './modules/working-days/working-day.module'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    FirebaseModule,

    // Database modules
    AccountEventModule,
    AccountModule,
    ActivityModule,
    AssessmentModule,
    NoteModule,
    PatientPillarModule,
    PatientResponsibleModule,
    PatientTherapistModule,
    PatientModule,
    PillarModule,
    ResourceModule,
    ResponsibleModule,
    TherapistModule,
    WorkingDayModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuardProvider]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*')
  }
}
