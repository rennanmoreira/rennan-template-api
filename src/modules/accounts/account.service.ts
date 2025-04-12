import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common'
import { EventType, Prisma } from '@prisma/client'
import {
  CreateAccountDTO,
  FilterAccountDTO,
  UpdateAccountDTO,
  ResponseAccountDTO,
  SortByAccountDTO,
  ResponseAccountListDTO
} from '@accounts/account.dto'
import { parseAccount, parseAccountList } from '@accounts/account.parser'
import { AccountRepository } from '@accounts/account.repository'
import { createMetaData } from '@helpers/metadata.helper'

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async create(data: CreateAccountDTO): Promise<ResponseAccountDTO> {
    try {
      const account = await this.accountRepository.create({
        ...data
      })

      return parseAccount(account)
    } catch (error: Error | any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Account already exists')
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
    filters?: FilterAccountDTO
    sortBy?: SortByAccountDTO
  }): Promise<ResponseAccountListDTO> {
    try {
      const skip = (page - 1) * offset
      const where: Prisma.AccountWhereInput = this.buildFilters(filters)
      const orderBy: Prisma.AccountOrderByWithRelationInput[] = this.buildOrderBy(sortBy)

      const accounts = await this.accountRepository.findMany({
        skip,
        take: offset,
        where,
        orderBy
      })

      const parsedAccounts = parseAccountList(accounts)

      return {
        data: parsedAccounts,
        meta: createMetaData(accounts.count, page, offset)
      }
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Account not found')
      }

      throw error
    }
  }

  async getById(id: string): Promise<ResponseAccountDTO> {
    try {
      const account = await this.accountRepository.getById(id)

      return parseAccount(account)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Account not found')
      }

      throw error
    }
  }

  async update(account_id: string, data: UpdateAccountDTO): Promise<ResponseAccountDTO> {
    try {
      const accountUpdateData = this.buildUpdateData(data)

      const account = await this.accountRepository.update(account_id, accountUpdateData)

      return parseAccount(account)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Account not found')
      }

      throw error
    }
  }

  async delete(account_id: string): Promise<ResponseAccountDTO> {
    try {
      return await this.accountRepository.delete(account_id)
    } catch (error: Error | any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Account not found')
      }

      if (error.code === 'P2020') {
        throw new InternalServerErrorException('Account cannot be deleted')
      }

      throw error
    }
  }

  async getByEmail(email: string): Promise<ResponseAccountDTO> {
    try {
      const account = await this.accountRepository.getByEmail(email)

      if (!account) {
        throw new NotFoundException('Account not found or is deleted')
      }

      return parseAccount(account)
    } catch (error: Error | any) {
      throw error
    }
  }

  async getByProviderAccountId(provider_account_id: string): Promise<ResponseAccountDTO> {
    try {
      const account = await this.accountRepository.getByproviderAccountId(provider_account_id)

      if (!account) {
        throw new NotFoundException('Account not found or is deleted')
      }

      return parseAccount(account)
    } catch (error: Error | any) {
      throw error
    }
  }

  async verifyIfEmailExists(email: string): Promise<boolean> {
    try {
      return this.accountRepository.verifyIfEmailExists(email)
    } catch (error: Error | any) {
      throw error
    }
  }

  async createAccountEvent(account_id: string, type: EventType, description: string) {
    return await this.accountRepository.update(account_id, { events: { create: { type, description } } })
  }

  async createAccountEventByEmail(email: string, type: EventType, description: string) {
    return await this.accountRepository.updateWithEmail(email, { events: { create: { type, description } } })
  }

  private buildUpdateData(data: UpdateAccountDTO): Prisma.AccountUpdateInput {
    const responsibleUpdateData = Object.fromEntries(
      Object.entries({
        ...data
      }).filter((value) => value !== undefined)
    )

    return {
      ...responsibleUpdateData
    }
  }

  private buildFilters(filters: FilterAccountDTO): Prisma.AccountWhereInput {
    const where: Prisma.AccountWhereInput = {}

    if (filters.name) {
      where.name = { mode: 'insensitive', contains: filters.name }
    }

    return where
  }

  private buildOrderBy(fields: SortByAccountDTO): Prisma.AccountOrderByWithRelationInput[] {
    const orderBy: Prisma.AccountOrderByWithRelationInput[] = []

    const name =
      fields.sort_by_name === 'asc'
        ? fields.sort_by_name
        : fields.sort_by_name === 'desc'
          ? fields.sort_by_name
          : undefined
    if (name) {
      orderBy.push({ name })
    }

    const created_at =
      fields.sort_by_created_at === 'asc'
        ? fields.sort_by_created_at
        : fields.sort_by_created_at === 'desc'
          ? fields.sort_by_created_at
          : undefined
    if (created_at) {
      orderBy.push({ created_at })
    }

    const updated_at =
      fields.sort_by_updated_at === 'asc'
        ? fields.sort_by_updated_at
        : fields.sort_by_updated_at === 'desc'
          ? fields.sort_by_updated_at
          : undefined
    if (updated_at) {
      orderBy.push({ updated_at })
    }

    return orderBy
  }
}
