import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ResponseMetaDTO } from '@utils/dtos/pagination.dto'
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsJSON } from 'class-validator'
import { JsonValue } from '@prisma/client/runtime/library'

export class CreateAccountDTO {
  @ApiProperty({
    example: 'Email example',
    type: String,
    description: 'Email of the Account'
  })
  @IsString()
  email: string

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is email verified of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is active of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is admin of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is moderator of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_moderator?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is provider anonymous of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_provider_anonymous?: boolean

  @ApiProperty({
    example: 'Name example',
    type: String,
    description: 'Name of the Account'
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    example: 'First name example',
    type: String,
    description: 'First name of the Account'
  })
  @IsOptional()
  @IsString()
  first_name?: string

  @ApiPropertyOptional({
    example: 'Last name example',
    type: String,
    description: 'Last name of the Account'
  })
  @IsOptional()
  @IsString()
  last_name?: string

  @ApiPropertyOptional({
    example: 'Lead origin example',
    type: String,
    description: 'Lead origin of the Account'
  })
  @IsOptional()
  @IsString()
  lead_origin?: string

  @ApiPropertyOptional({
    example: 'Photo url example',
    type: String,
    description: 'Photo url of the Account'
  })
  @IsOptional()
  @IsString()
  photo_url?: string

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00.000Z',
    type: Date,
    description: 'Birth date of the Account'
  })
  @IsOptional()
  @IsDate()
  birth_date?: Date

  @ApiPropertyOptional({
    example: 'Provider example',
    type: String,
    description: 'Provider of the Account'
  })
  @IsOptional()
  @IsString()
  provider?: string

  @ApiPropertyOptional({
    example: 'Provider aud example',
    type: String,
    description: 'Provider aud of the Account'
  })
  @IsOptional()
  @IsString()
  provider_aud?: string

  @ApiProperty({
    example: 'Provider user id example',
    type: String,
    description: 'Provider user id of the Account'
  })
  @IsString()
  provider_account_id: string

  @ApiProperty({
    example: 'Provider identity id example',
    type: String,
    description: 'Provider identity id of the Account'
  })
  @IsString()
  provider_identity_id: string
}

export class UpdateAccountDTO {
  @ApiPropertyOptional({
    example: 'Email example',
    type: String,
    description: 'Email of the Account'
  })
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is email verified of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is active of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is admin of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is moderator of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_moderator?: boolean

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
    description: 'Is provider anonymous of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_provider_anonymous?: boolean

  @ApiPropertyOptional({
    example: 'Name example',
    type: String,
    description: 'Name of the Account'
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    example: 'First name example',
    type: String,
    description: 'First name of the Account'
  })
  @IsOptional()
  @IsString()
  first_name?: string

  @ApiPropertyOptional({
    example: 'Last name example',
    type: String,
    description: 'Last name of the Account'
  })
  @IsOptional()
  @IsString()
  last_name?: string

  @ApiPropertyOptional({
    example: 'Lead origin example',
    type: String,
    description: 'Lead origin of the Account'
  })
  @IsOptional()
  @IsString()
  lead_origin?: string

  @ApiPropertyOptional({
    example: 'Photo url example',
    type: String,
    description: 'Photo url of the Account'
  })
  @IsOptional()
  @IsString()
  photo_url?: string

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00.000Z',
    type: Date,
    description: 'Birth date of the Account'
  })
  @IsOptional()
  @IsDate()
  birth_date?: Date

  @ApiPropertyOptional({
    example: 'Provider example',
    type: String,
    description: 'Provider of the Account'
  })
  @IsOptional()
  @IsString()
  provider?: string

  @ApiPropertyOptional({
    example: 'Provider aud example',
    type: String,
    description: 'Provider aud of the Account'
  })
  @IsOptional()
  @IsString()
  provider_aud?: string

  @ApiPropertyOptional({
    example: 'Provider user id example',
    type: String,
    description: 'Provider user id of the Account'
  })
  @IsOptional()
  @IsString()
  provider_account_id?: string

  @ApiPropertyOptional({
    example: 'Provider identity id example',
    type: String,
    description: 'Provider identity id of the Account'
  })
  @IsOptional()
  @IsString()
  provider_identity_id?: string
}

export class FilterAccountDTO {
  @ApiPropertyOptional({
    type: String,
    description: 'Email of the Account'
  })
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is email verified of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_email_verified?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is active of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is admin of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is moderator of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_moderator?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Is provider anonymous of the Account'
  })
  @IsOptional()
  @IsBoolean()
  is_provider_anonymous?: boolean

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the Account'
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    type: String,
    description: 'First name of the Account'
  })
  @IsOptional()
  @IsString()
  first_name?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Last name of the Account'
  })
  @IsOptional()
  @IsString()
  last_name?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Lead origin of the Account'
  })
  @IsOptional()
  @IsString()
  lead_origin?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Photo url of the Account'
  })
  @IsOptional()
  @IsString()
  photo_url?: string

  @ApiPropertyOptional({
    type: Date,
    description: 'Birth date of the Account'
  })
  @IsOptional()
  @IsDate()
  birth_date?: Date

  @ApiPropertyOptional({
    type: String,
    description: 'Provider of the Account'
  })
  @IsOptional()
  @IsString()
  provider?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Provider aud of the Account'
  })
  @IsOptional()
  @IsString()
  provider_aud?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Provider user id of the Account'
  })
  @IsOptional()
  @IsString()
  provider_account_id?: string

  @ApiPropertyOptional({
    type: String,
    description: 'Provider identity id of the Account'
  })
  @IsOptional()
  @IsString()
  provider_identity_id?: string
}

export class SortByAccountDTO {
  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort by Account name',
    type: String
  })
  @IsOptional()
  @IsString()
  sort_by_name?: string

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by Account created_at',
    type: String
  })
  @IsOptional()
  @IsString()
  sort_by_created_at?: string

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by Account updated_at',
    type: String,
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  sort_by_updated_at?: string = 'desc'
}

export class ResponseAccountDTO extends CreateAccountDTO {
  @ApiProperty({
    example: 1,
    description: 'Account id',
    type: String
  })
  @IsString()
  id: string

  @ApiPropertyOptional({
    example: 'token',
    description: 'current auth token of the account',
    type: String
  })
  @IsOptional()
  @IsString()
  token?: string

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Date of creation',
    type: Date
  })
  @IsOptional()
  @IsDate()
  created_at?: Date

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Date of last update',
    type: Date
  })
  @IsOptional()
  @IsDate()
  updated_at?: Date

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    description: 'Date of deletion',
    type: Date
  })
  @IsOptional()
  @IsDate()
  deleted_at?: Date
}

export class ResponseAccountListDTO {
  @ApiProperty({
    description: 'List of Account',
    type: [ResponseAccountDTO]
  })
  data: ResponseAccountDTO[]

  @ApiProperty({
    title: 'Meta',
    description: 'Meta information',
    type: ResponseMetaDTO
  })
  meta: ResponseMetaDTO
}
