import { NestFactory } from '@nestjs/core'
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from './app.module'
import { urlencoded, json } from 'express'
import { PrismaExceptionsFilter } from '@exceptions/prisma-exceptions.filters'
import {
  METHODS,
  ORIGIN,
  APP_VERSION,
  MAX_BODY_SIZE,
  IS_SWAGGER_AUTH_ENABLED,
  IS_DEVELOPMENT,
  IS_PRODUCTION
} from './helpers/environment.helper'
import { TimezoneInterceptor } from './utils/interceptors/timezone.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SwaggerAuthMiddleware } from './middlewares/swagger-auth.middleware'

async function bootstrap() {
  console.log('BOOSTRAP')
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('IS_PRODUCTION', IS_PRODUCTION)
  console.log('IS_DEVELOPMENT', IS_DEVELOPMENT)

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
      prefix: 'API',
      depth: 8,
      timestamp: true,
      colors: IS_DEVELOPMENT
    })
  })

  app.useGlobalFilters(new PrismaExceptionsFilter())
  app.useGlobalInterceptors(new TimezoneInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.use(json({ limit: MAX_BODY_SIZE }))
  app.use(urlencoded({ extended: true, limit: MAX_BODY_SIZE }))

  app.enableCors({
    origin: ORIGIN,
    methods: METHODS,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-API-Version',
    credentials: true
  })

  const majorAppVersion = APP_VERSION?.length ? APP_VERSION.split('.')[0] : '1'

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: majorAppVersion
  })

  const options = new DocumentBuilder()
    .setTitle('Rennan API')
    .setDescription('The Rennan API')
    .setVersion(APP_VERSION)
    .addBearerAuth()
    // .addSecurityRequirements('bearer')
    //     {
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    //   name: 'JWT',
    //   description: 'Enter JWT token',
    //   in: 'header',
    // },
    // 'jwt-auth',
    .build()

  if (IS_SWAGGER_AUTH_ENABLED) {
    app.use('/api-swagger', new SwaggerAuthMiddleware().use)
    app.use('/api-swagger-json', new SwaggerAuthMiddleware().use)
  }
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-swagger', app, document)

  const PORT = process.env.PORT || 3000
  await app.listen(PORT)
}

bootstrap()
