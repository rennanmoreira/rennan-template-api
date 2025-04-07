import { Body, Controller, Get, HttpCode, Post, Res, Req, Session, Version } from '@nestjs/common'
import { EmailDTO, GoogleAccountRegisterDTO, LoginDTO, LoginWithLinkDTO, RegisterDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ErrorResponse } from '@utils/dtos/error-response.dto'
import { ResponseAccountDTO } from '@accounts/account.dto'
import { Request, Response } from 'express'
import { Public } from 'src/decorators/public.decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/role.enum'

@ApiTags('Authentications')
@Controller({ path: 'auth', version: '1' })
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  type: ErrorResponse
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('verify-email')
  @Public()
  async verifyIfEmailExists(
    @Res() response: Response,
    @Body() data: EmailDTO
  ): Promise<Response<any, Record<string, any>>> {
    return response.sendStatus((await this.authService.verifyIfEmailExists(data.email)) ? 200 : 204)
  }

  @Post('register')
  @HttpCode(201)
  @Public()
  async register(@Body() data: RegisterDTO): Promise<ResponseAccountDTO> {
    return this.authService.register(data)
  }

  @Post('login')
  @HttpCode(200)
  @Public()
  async login(@Body() data: LoginDTO): Promise<ResponseAccountDTO> {
    return this.authService.login(data.email, data.password)
  }

  @Post('login-with-link')
  @HttpCode(200)
  @Public()
  async loginWithLink(@Req() request: Request, @Body() data: LoginWithLinkDTO): Promise<{ url: string }> {
    const base_url = data.base_url || request?.headers?.origin
    return this.authService.loginWithLink(data.email, base_url)
  }

  @Post('google/register')
  @HttpCode(201)
  @ApiBearerAuth()
  async registerWithGoogle(
    @Req() request: Request,
    @Body('is_provider_anonymous') is_provider_anonymous: boolean
  ): Promise<ResponseAccountDTO> {
    return this.authService.registerWithGoogle(request['user'], is_provider_anonymous)
  }

  @Post('google/login')
  @HttpCode(200)
  @ApiBearerAuth()
  async loginWithGoogle(@Req() request: Request): Promise<ResponseAccountDTO> {
    return this.authService.loginWithGoogle(request['user'])
  }

  // @Post('logout')
  // @HttpCode(200)
  // async logout(@Body('refresh_token') refresh_token: string): Promise<void> {
  //   await this.authService.logout(refresh_token)
  // }

  @Get('me')
  @HttpCode(200)
  @ApiBearerAuth()
  async getMe(@Req() request: Request): Promise<ResponseAccountDTO> {
    return this.authService.getAccountData(request['user'])
  }

  // @Post('refresh-token')
  // @HttpCode(201)
  // async refresh(@Body('refresh_token') refresh_token: string): Promise<{ access_token: string }> {
  //   return this.authService.refreshToken(refresh_token)
  // }

  // @Post('reset-password')
  // @HttpCode(200)
  // async resetPassword(@Body() email: string): Promise<void> {
  //   await this.authService.resetPassword(email)
  // }

  // @Post('change-password')
  // @HttpCode(200)
  // async changePassword(@Body() data: ChangePasswordDTO): Promise<void> {
  //   await this.authService.changePassword(data)
  // }
}
