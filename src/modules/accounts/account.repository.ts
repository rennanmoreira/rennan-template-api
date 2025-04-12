import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { AccountWithRelations } from '@accounts/account.type'
import { FindManyWithCount } from '@types'

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AccountCreateInput): Promise<AccountWithRelations> {
    return await this.prisma.account.create({ data })
  }

  async update(id: string, data: Prisma.AccountUpdateInput): Promise<AccountWithRelations> {
    return await this.prisma.account.update({ where: { id }, data })
  }

  async delete(id: string): Promise<AccountWithRelations> {
    return await this.prisma.account.delete({ where: { id } })
  }

  async findMany(filter: Prisma.AccountFindManyArgs): Promise<{ data: AccountWithRelations[]; count: number }> {
    return (await this.prisma.account.findMany(filter)) as unknown as FindManyWithCount<AccountWithRelations>
  }

  async findUnique(filter: Prisma.AccountFindUniqueArgs): Promise<AccountWithRelations> {
    return await this.prisma.account.findUnique(filter)
  }

  async getById(id: string): Promise<AccountWithRelations> {
    return await this.prisma.account.findUnique({ where: { id } })
  }

  async updateWithEmail(email: string, data: Prisma.AccountUpdateInput): Promise<AccountWithRelations> {
    return await this.prisma.account.update({ where: { email }, data })
  }

  async getByEmail(email: string): Promise<AccountWithRelations | null> {
    return await this.prisma.account.findUnique({ where: { email } })
  }

  async getByproviderAccountId(provider_account_id: string): Promise<AccountWithRelations | null> {
    return await this.prisma.account.findFirst({ where: { provider_account_id } })
  }

  async verifyIfEmailExists(email: string): Promise<boolean> {
    return (await this.prisma.account.count({ where: { email } })) > 0
  }
}
