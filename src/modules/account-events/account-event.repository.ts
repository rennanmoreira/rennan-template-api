import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { AccountEventWithRelations } from '@account-events/account-event.type'
import { FindManyWithCount } from '@types'

@Injectable()
export class AccountEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AccountEventCreateInput): Promise<AccountEventWithRelations> {
    return await this.prisma.accountEvent.create({ data })
  }

  async update(id: number, data: Prisma.AccountEventUpdateInput): Promise<AccountEventWithRelations> {
    return await this.prisma.accountEvent.update({ where: { id }, data })
  }

  async delete(id: number): Promise<AccountEventWithRelations> {
    return await this.prisma.accountEvent.delete({ where: { id } })
  }

  async findMany(
    filter: Prisma.AccountEventFindManyArgs
  ): Promise<{ data: AccountEventWithRelations[]; count: number }> {
    return (await this.prisma.accountEvent.findMany(filter)) as unknown as FindManyWithCount<AccountEventWithRelations>
  }

  async findUnique(filter: Prisma.AccountEventFindUniqueArgs): Promise<AccountEventWithRelations> {
    return await this.prisma.accountEvent.findUnique(filter)
  }

  async getById(id: number): Promise<AccountEventWithRelations> {
    return await this.prisma.accountEvent.findUnique({ where: { id } })
  }
}
