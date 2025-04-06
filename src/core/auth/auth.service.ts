import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import {
  ResponseAuthMeDTO,
  LoginDTO,
  RegisterDTO,
  GoogleAccountRegisterDTO,
  GoogleAccountDTO,
  EmailDTO
} from './auth.dto'
import { AccountService } from '@accounts/account.service'
import { ResponseAccountDTO } from '@accounts/account.dto'
import { FirebaseService } from '../firebase/firebase.service'
import { EventType } from '@prisma/client'
import { splitUserName } from 'src/helpers/format-string.helper'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private readonly accountService: AccountService,
    private readonly firebaseService: FirebaseService
  ) {}

  async register(data: RegisterDTO): Promise<ResponseAccountDTO> {
    try {
      if (await this.accountService.verifyIfEmailExists(data.email))
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)

      if (data.phone && (await this.accountService.verifyIfPhoneExists(data.phone)))
        throw new HttpException('Phone already exists', HttpStatus.BAD_REQUEST)

      const registerResponse = await this.firebaseService.register(data.email, data.password)
      const decodedToken = await this.firebaseService.getDecodedToken(registerResponse.idToken)

      if (!decodedToken) throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST)

      const [first_name, last_name] = splitUserName(data?.name)

      const account = await this.accountService.create({
        name: data?.name,
        first_name,
        last_name,
        lead_origin: 'rennan-api',
        email: data.email,
        phone: data.phone || null,
        is_active: true,
        is_provider_anonymous: false,
        is_email_verified: decodedToken?.email_verified || false,
        provider: decodedToken?.firebase?.sign_in_provider || 'password',
        provider_aud: decodedToken.aud,
        provider_user_id: decodedToken.user_id,
        provider_identity_id: data.email,
      })

      return {
        token: registerResponse.idToken,
        ...account
      }
    } catch (error: Error | any) {
      this.logger.error('[register] ' + error)

      throw error
    }
  }

  async registerWithGoogle(user: GoogleAccountDTO, is_provider_anonymous: boolean): Promise<ResponseAccountDTO> {
    try {
      if (!user) throw new UnauthorizedException('User not found')

      if (is_provider_anonymous === undefined) {
        throw new UnauthorizedException('Missing required fields: is_provider_anonymous')
      }

      const accountExist = await this.accountService.verifyIfEmailExists(user.email)

      if (accountExist) throw new UnauthorizedException('User email already exists in database')

      const [first_name, last_name] = splitUserName(user?.name)

      delete user.auth_time
      delete user.exp_time

      return this.accountService.create({
        ...user,
        first_name,
        last_name,
        is_active: true,
        is_provider_anonymous,
        lead_origin: 'rennan-api',
      })
    } catch (error) {
      throw this.handleTokenUnauthorizedError(error)
    }
  }

  async login(email: string, password: string): Promise<ResponseAccountDTO> {
    try {
      const response = await this.firebaseService.login(email, password)

      if (!response?.idToken) throw new UnauthorizedException('Invalid credentials')

      const user = await this.firebaseService.getUserByToken(response.idToken)

      if (!user) throw new UnauthorizedException('User not found')

      const userAccount = await this.accountService.getByEmail(user.email)

      if (!userAccount) throw new UnauthorizedException('User not found in database')

      await this.accountService.createAccountEvent(userAccount.id, EventType.LOGIN, 'Login with email/password')

      return {
        token: response.idToken,
        ...userAccount
      }
    } catch (error) {
      this.logger.error('[login] ' + error, error)

      await this.createUnauthorizedAccountEventByEmail(error, email, 'Login failed (Email/Password)')

      throw error instanceof Error
        ? this.handleTokenUnauthorizedError(error)
        : new Error('Error logging with email/password')
    }
  }

  async loginWithLink(email: string, base_url: string): Promise<{ url: string }> {
    try {
      const { url } = await this.firebaseService.loginWithLink(email, base_url)

      await this.accountService.createAccountEventByEmail(email, EventType.LOGIN, 'Login with link')

      return { url }
    } catch (error) {
      this.logger.error('[login] ' + error, error)

      await this.createUnauthorizedAccountEventByEmail(error, email, 'Login failed (Link)')

      throw error instanceof Error ? this.handleTokenUnauthorizedError(error) : new Error('Error logging with link')
    }
  }

  async loginWithGoogle(user: GoogleAccountDTO): Promise<ResponseAccountDTO> {
    let account_id = null

    try {
      const accountData = await this.accountService.getByEmail(user.email)
      account_id = accountData.id

      await this.accountService.createAccountEvent(account_id, EventType.LOGIN, 'Login with Google')

      return accountData
    } catch (error) {
      this.logger.error('[login] ' + error, error)

      await this.createUnauthorizedAccountEvent(error, account_id, 'Login failed (Google)')

      throw error instanceof Error ? this.handleTokenUnauthorizedError(error) : new Error('Error logging with google')
    }
  }

  async getAccountData(user: GoogleAccountDTO): Promise<ResponseAccountDTO> {
    try {
      return this.accountService.getByEmail(user.email)
    } catch (error) {
      this.logger.error('[login] ' + error, error)

      throw this.handleTokenUnauthorizedError(error)
    }
  }

  async verifyIfEmailExists(email: string): Promise<boolean> {
    try {
      return this.accountService.verifyIfEmailExists(email)
    } catch (error) {
      this.logger.error('[verifyIfEmailExists] ' + error, error)

      throw this.handleTokenUnauthorizedError(error)
    }
  }

  async createUnauthorizedAccountEvent(error: Error, account_id: string, description: string) {
    try {
      if (error instanceof UnauthorizedException && account_id) {
        await this.accountService.createAccountEvent(
          account_id,
          EventType.LOGIN_FAILED,
          `${description}: ${error.message || error.toString()}`
        )
      }
    } catch (error) {
      this.logger.error('[createUnauthorizedAccountEvent] ' + error, error)

      throw this.handleTokenUnauthorizedError(error)
    }
  }

  async createUnauthorizedAccountEventByEmail(error: Error, account_email: string, description: string) {
    try {
      if (error instanceof UnauthorizedException) {
        const user = await this.accountService.getByEmail(account_email)

        if (user) {
          await this.accountService.createAccountEvent(
            user.id,
            EventType.LOGIN_FAILED,
            `${description}: ${error.message || error.toString()}`
          )
        }
      }
    } catch (error) {
      this.logger.error('[createUnauthorizedAccountEventByEmail] ' + error, error)

      throw this.handleTokenUnauthorizedError(error)
    }
  }

  handleTokenUnauthorizedError(error: any) {
    // this.logger.error('[handleTokenUnauthorizedError] ' + error, error)

    return new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid token',
        server: error.message
      },
      HttpStatus.UNAUTHORIZED,
      {
        cause: error
      }
    )
  }
}
