import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ResponseMetaDTO } from '@utils/dtos/pagination.dto'
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsJSON } from 'class-validator'
import { EventType } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export class CreateAccountEventDTO {
  @ApiProperty({
    example: 'Account id example',
    type: String,
    description: 'Account id of the AccountEvent'
  })
  @IsString()
  account_id: string

  @ApiPropertyOptional({
    enum: EventType,
    description: 'Type of the AccountEvent'
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType

  @ApiPropertyOptional({
    example: 'Description example',
    type: String,
    description: 'Description of the AccountEvent'
  })
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateAccountEventDTO {
  @ApiPropertyOptional({
    example: 'Account id example',
    type: String,
    description: 'Account id of the AccountEvent'
  })
  @IsOptional()
  @IsString()
  account_id?: string

  @ApiPropertyOptional({
    enum: EventType,
    description: 'Type of the AccountEvent'
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType

  @ApiPropertyOptional({
    example: 'Description example',
    type: String,
    description: 'Description of the AccountEvent'
  })
  @IsOptional()
  @IsString()
  description?: string
}

export class FilterAccountEventDTO {
  @ApiPropertyOptional({
    type: String,
    description: 'Account id of the AccountEvent'
  })
  @IsOptional()
  @IsString()
  account_id?: string

  @ApiPropertyOptional({
    enum: EventType,
    description: 'Type of the AccountEvent'
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType

  @ApiPropertyOptional({
    type: String,
    description: 'Description of the AccountEvent'
  })
  @IsOptional()
  @IsString()
  description?: string
}

export class SortByAccountEventDTO {
  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by AccountEvent created_at',
    type: String
  })
  @IsOptional()
  @IsString()
  sort_by_created_at?: string

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by AccountEvent updated_at',
    type: String,
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  sort_by_updated_at?: string = 'desc'
}

export class ResponseAccountEventDTO extends CreateAccountEventDTO {
  @ApiProperty({
    example: 1,
    description: 'AccountEvent id',
    type: Number
  })
  @IsNumber()
  id: number

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

export class ResponseAccountEventListDTO {
  @ApiProperty({
    description: 'List of AccountEvent',
    type: [ResponseAccountEventDTO]
  })
  data: ResponseAccountEventDTO[]

  @ApiProperty({
    title: 'Meta',
    description: 'Meta information',
    type: ResponseMetaDTO
  })
  meta: ResponseMetaDTO
}
