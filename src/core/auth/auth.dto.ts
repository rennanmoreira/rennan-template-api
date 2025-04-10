import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  IsStrongPassword,
  IsBoolean
} from 'class-validator'
import { Role } from 'src/enums/role.enum'
import { ResponseAccountDTO } from '@accounts/account.dto'

export interface JwtAccessTokenPayload {
  sub: number
  email: string
  role: Role
  token_version?: number
}

export interface JwtRefreshTokenPayload {
  sub: number
  email: string
  role: Role
  token_version?: number
}

export class GoogleAccountDTO {
  @ApiProperty({
    example: 'User',
    description: 'Name of the account',
    type: String
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'user@test.com',
    description: 'Email of the account',
    type: String
  })
  @IsString()
  email: string

  @ApiProperty({
    example: '551399999999',
    description: 'Phone of the account',
    type: String
  })
  @IsString()
  phone: string

  @ApiProperty({
    example: 1741026154,
    description: 'Auth time of the account',
    type: Number
  })
  auth_time: number

  @ApiProperty({
    example: 1741029754,
    description: 'Expiration time of the account',
    type: Number
  })
  exp_time: number

  @ApiProperty({
    example: false,
    description: 'Is the account email verified in the provider',
    type: Boolean
  })
  email_verified: boolean

  @ApiProperty({
    example: '123456',
    description: 'Password of the account',
    type: String
  })
  @IsString()
  password: string

  @ApiProperty({
    example: 'google',
    description: 'Provider of the account',
    type: String
  })
  @IsString()
  provider: string

  @ApiProperty({
    example: 'rennan-api',
    description: 'Provider of the account',
    type: String
  })
  @IsString()
  provider_aud: string

  @ApiProperty({
    example: 'oWvQEHOy46f0L2BQ9x3StsUvidasd',
    description: 'Provider user id of the account',
    type: String
  })
  @IsString()
  provider_user_id: string

  @ApiProperty({
    example: 'user@test.com',
    description: 'Provider identity id of the account',
    type: String
  })
  @IsString()
  provider_identity_id: string
}

export class GoogleAccountRegisterDTO {
  @ApiProperty({
    example: false,
    description: 'Is the account anonymous in the provider'
  })
  @IsBoolean()
  is_provider_anonymous: boolean

  @ApiProperty({
    example: 'user@test.com',
    description: 'Email of the account',
    type: String
  })
  @IsString()
  email: string
}

export class AuthLoginDto {
  @IsEmail({}, { message: 'E-mail ou senha inválidos' })
  @MinLength(3, { message: 'E-mail ou senha inválidos' })
  email: string

  @MinLength(6, { message: 'E-mail ou senha inválidos' })
  // @IsStrongPassword({minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}, { message: 'E-mail ou senha inválidos'})
  password: string
}

export class AuthRefreshTokenDto {
  @IsString({ message: 'Refresh token inválido' })
  @IsNotEmpty({ message: 'Refresh token não pode ser vazio' })
  refreshToken: string
}

export class EmailDTO {
  @ApiProperty({
    example: 'user@test.com',
    description: 'Email of the account',
    type: String
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'E-mail inválido' })
  @MinLength(3, { message: 'E-mail inválido' })
  email: string
}

export class LoginDTO extends EmailDTO {
  @ApiProperty({
    example: '123456',
    description: 'Password of the account',
    type: String
  })
  @IsString()
  @MinLength(6, { message: 'E-mail ou senha inválidos' })
  password: string
}

export class LoginWithLinkDTO extends EmailDTO {
  @ApiPropertyOptional({
    example: 'https://api.rennan.com.br',
    description: 'Base url to redirect login',
    type: String
  })
  @IsOptional()
  @IsString()
  base_url?: string
}

export class RegisterDTO {
  @ApiProperty({
    example: 'user@test.com',
    description: 'Email of the account',
    type: String
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'O campo e-mail precisa ter pelo menos 3 caracteres' })
  @IsEmail({}, { message: 'O campo e-mail está inválido' })
  email: string

  @ApiProperty({
    example: '123456',
    description: 'Password of the account',
    type: String
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Senha precisa ter no mínimo 6 caracteres' })
  @IsStrongPassword(
    { minLength: 6, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 },
    { message: 'Senha precisa ter no mínimo 6 caracteres' }
  )
  password: string

  @ApiProperty({
    example: 'User Test',
    description: 'Display name of the account',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: `Campo 'name' não pode ser vazio` })
  @MinLength(6, { message: 'name precisa ter no mínimo 6 caracteres' })
  name: string

  @ApiPropertyOptional({
    example: '551399999999',
    description: 'Phone number of the account',
    type: String
  })
  @IsOptional()
  @IsString()
  phone?: string
}

export class ResponseAuthMeDTO extends ResponseAccountDTO {
  @ApiProperty({
    example: 1,
    description: 'Id of the account',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiProperty({
    example: 'user@test.com',
    description: 'Email of the account',
    type: String
  })
  @IsEmail()
  email: string

  @ApiPropertyOptional({
    example: Role.PATIENT,
    description: 'Role of the account',
    type: String,
    enum: Role
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role

  @ApiPropertyOptional({
    example: 'refresh_token',
    description: 'Refresh token of the account',
    type: String
  })
  @IsString()
  @IsOptional()
  refresh_token?: string
}
