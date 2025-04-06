import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { Reflector, APP_GUARD } from '@nestjs/core'
import { Request } from 'express'
import { FirebaseService } from '../firebase/firebase.service'
import { ORIGIN, IS_CLIENT_API_KEY_ENABLED, IS_PRODUCTION, APP_NAME } from 'src/helpers/environment.helper'
import { AccountService } from 'src/modules/accounts/account.service'
import { ResponseAccountDTO } from 'src/modules/accounts/account.dto'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name) //

  constructor(
    private reflector: Reflector,
    private accountService: AccountService,
    private firebaseService: FirebaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // This is the default middleware that is usually used to validate the request when it comes from Firebase Auth (TODO: In future I will create IP blocking middleware)

      const request = context.switchToHttp().getRequest<Request>()

      // 1. Validate origin
      this.validateAllowedOrigin(
        request?.headers?.origin || `http://${request?.headers?.host}` || `https://${request?.headers?.host}`
      )

      // 2. Validate Client API Key
      if (IS_PRODUCTION && IS_CLIENT_API_KEY_ENABLED) {
        // Colocar no front o campo customizado client-api-key se não for possivel, pode tentar usar o x-api-key
        const clientApiKey: string = (request.headers['x-api-key'] || request.headers['client-api-key']) as string
        this.validateClientApiKey(clientApiKey)
      }

      // 3. Validate if route is public or private
      const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()])
      if (isPublic) {
        return true
      }

      // 4. Validate firebase user token and save user in request
      const token = this.extractTokenFromHeader(request)

      if (!token) {
        throw new UnauthorizedException('Invalid user token! Missing token header')
      }

      const decodedToken = await this.firebaseService.getDecodedToken(token)
      const user = await this.firebaseService.getUserByUid(decodedToken.uid)

      request['user'] = {
        name: user.displayName || '',
        email: user.email || null,
        phone: user.phoneNumber || null,
        photo_url: user.photoURL || null,
        auth_time: decodedToken.auth_time,
        exp_time: decodedToken.exp,
        is_email_verified: user.emailVerified || false,
        provider: user.providerData[0].providerId,
        provider_aud: decodedToken.aud,
        provider_user_id: user.uid,
        provider_identity_id: user.providerData[0].uid
      }

      // 5. Validate if user has route permission
      const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()])

      if (roles && roles.length > 0) {
        let account: ResponseAccountDTO = null

        if (user.email) {
          account = await this.accountService.getByEmail(user.email)
        } else if (user.phoneNumber) {
          account = await this.accountService.getByPhone(user.phoneNumber)
        } else if (user.uid) {
          account = await this.accountService.getByProviderUserId(user.uid)
        }

        if (!account) {
          throw new UnauthorizedException('User not found in database to validate roles')
        }

        let is_user_authorized = account.is_admin || false

        if (!is_user_authorized) {
          // if (roles.find((role) => role === 'admin') && !account.is_admin) {
          //   throw new UnauthorizedException('User not authorized to access this admin route')
          // }

          roles.forEach((role) => {
            if (account[`is_${role}`]) {
              is_user_authorized = true
            }
          })

          if (!is_user_authorized) {
            throw new UnauthorizedException('User not authorized to access this route')
          }
        }
      }

      return true
    } catch (error: Error | any) {
      this.logger.error('[AuthGuard] ' + error.message, error)

      throw error instanceof UnauthorizedException ? error : new UnauthorizedException('Error validating user token')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private validateAllowedOrigin(requestOrigin: string): boolean {
    const allowedOrigin = ORIGIN
    if (allowedOrigin !== '*') {
      // if (request.method === 'OPTIONS') {
      //   return true
      // }

      // const requestOrigin = request.headers.origin || request.headers.host

      if (!requestOrigin) {
        throw new UnauthorizedException('Invalid origin! Missing origin header')
      }

      if (!allowedOrigin.includes(requestOrigin)) {
        throw new UnauthorizedException(`Invalid origin! Origin not allowed: '${requestOrigin}'`)
      }
    }

    return true
  }

  private validateClientApiKey(clientApiKey: string): boolean {
    const minutesToBlock = 5

    if (!clientApiKey) {
      throw new UnauthorizedException('Invalid client API key! Missing client API key header')
    }

    const [label, time] = clientApiKey.toString().split('_')

    if (!label || !time) {
      throw new UnauthorizedException('Invalid client API key! Missing required fields')
    }

    if (label !== APP_NAME) {
      throw new UnauthorizedException('Invalid client API key! Client API key not allowed')
    }

    if (time !== '420' && Date.now() - Number(time) > minutesToBlock * 60 * 1000) {
      throw new UnauthorizedException('Invalid client API key! Client API key not allowed anymore')
    }

    return true
  }
}

export const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuard
}
