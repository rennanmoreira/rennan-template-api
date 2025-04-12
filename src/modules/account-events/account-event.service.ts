import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateAccountEventDTO,
  FilterAccountEventDTO,
  UpdateAccountEventDTO,
  ResponseAccountEventDTO,
  SortByAccountEventDTO,
  ResponseAccountEventListDTO
} from '@account-events/account-event.dto'
import { parseAccountEvent, parseAccountEventList } from '@account-events/account-event.parser'
import { AccountEventRepository } from '@account-events/account-event.repository'
import { createMetaData } from '@helpers/metadata.helper'

@Injectable()
export class AccountEventService {
  constructor(private accountEventRepository: AccountEventRepository) {}

  async create(data: CreateAccountEventDTO): Promise<ResponseAccountEventDTO> {
    try {
      const accountEvent = await this.accountEventRepository.create({
        ...data,
        account: { connect: { id: data.account_id } }
      })

      return parseAccountEvent(accountEvent)
    } catch (error: Error | any) {
      if (error.code === 'P2002') {
        throw new ConflictException('AccountEvent already exists')
      }
      throw error
    }
  }

  async getAll({
    page = 1,
    offset = 10,
    filters = {},
    sortBy = {}
  }: {
    page?: number
    offset?: number
    filters?: FilterAccountEventDTO
    sortBy?: SortByAccountEventDTO
  }): Promise<ResponseAccountEventListDTO> {
    try {
      const skip = (page - 1) * offset
      const where: Prisma.AccountEventWhereInput = this.buildFilters(filters)
      const orderBy: Prisma.AccountEventOrderByWithRelationInput[] = this.buildOrderBy(sortBy)

      const accountEvents = await this.accountEventRepository.findMany({
        skip,
        take: offset,
        where,
        orderBy
      })

      const parsedAccountEvents = parseAccountEventList(accountEvents)

      return {
        data: parsedAccountEvents,
        meta: createMetaData(accountEvents.count, page, offset)
      }
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('AccountEvent not found')
      }

      throw error
    }
  }

  async getById(id: number): Promise<ResponseAccountEventDTO> {
    try {
      const accountEvent = await this.accountEventRepository.getById(id)

      return parseAccountEvent(accountEvent)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('AccountEvent not found')
      }

      throw error
    }
  }

  async update(account_event_id: number, data: UpdateAccountEventDTO): Promise<ResponseAccountEventDTO> {
    try {
      const accountEventUpdateData = this.buildUpdateData(data)

      const accountEvent = await this.accountEventRepository.update(account_event_id, accountEventUpdateData)

      return parseAccountEvent(accountEvent)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('AccountEvent not found')
      }

      throw error
    }
  }

  async delete(account_event_id: number): Promise<ResponseAccountEventDTO> {
    try {
      return await this.accountEventRepository.delete(account_event_id)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('AccountEvent not found')
      }

      if (error.code === 'P2020') {
        throw new InternalServerErrorException('AccountEvent cannot be deleted')
      }

      throw error
    }
  }

  private buildUpdateData(data: UpdateAccountEventDTO): Prisma.AccountEventUpdateInput {
    const responsibleUpdateData = Object.fromEntries(
      Object.entries({
        ...data
      }).filter((value) => value !== undefined)
    )

    return {
      ...responsibleUpdateData
    }
  }

  private buildFilters(filters: FilterAccountEventDTO): Prisma.AccountEventWhereInput {
    const where: Prisma.AccountEventWhereInput = {}

    return where
  }

  private buildOrderBy(fields: SortByAccountEventDTO): Prisma.AccountEventOrderByWithRelationInput[] {
    const orderBy: Prisma.AccountEventOrderByWithRelationInput[] = []

    const created_at =
      fields.sort_by_created_at === 'asc'
        ? fields.sort_by_created_at
        : fields.sort_by_created_at === 'desc'
          ? fields.sort_by_created_at
          : undefined
    if (created_at) {
      orderBy.push({ created_at })
    }

    return orderBy
  }
}
