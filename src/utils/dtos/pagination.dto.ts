import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class Pagination {
  @ApiProperty({
    example: 1,
    description: 'Current page'
  })
  @IsNumber()
  page: number

  @ApiProperty({
    example: 120,
    description: 'Total of items returned'
  })
  @IsNumber()
  total: number

  @ApiProperty({
    example: 10,
    description: 'Items per page'
  })
  @IsNumber()
  pageSize: number

  @ApiProperty({
    example: 12,
    description: 'Total pages count'
  })
  @IsNumber()
  pageCount: number

  @ApiProperty({
    example: false,
    description: 'Is there a previous page'
  })
  @IsNumber()
  hasPreviousPage: boolean

  @ApiProperty({
    example: true,
    description: 'Is there a next page'
  })
  @IsNumber()
  hasNextPage: boolean
}

export class ResponseMetaDTO {
  @ApiProperty({
    type: Pagination,
    description: 'Pagination information'
  })
  pagination: Pagination
}
