import { Injectable, NestMiddleware } from '@nestjs/common'
import { SWAGGER_USERNAME, SWAGGER_PASSWORD } from '@helpers/environment.helper'
import * as basicAuth from 'basic-auth'

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const credentials = basicAuth(req)

    if (credentials && credentials.name === SWAGGER_USERNAME && credentials.pass === SWAGGER_PASSWORD) {
      return next()
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"')
    res.status(401).send('Authentication required')
  }
}
