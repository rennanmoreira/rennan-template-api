import { Test, TestingModule } from '@nestjs/testing'
import { AccountRepository } from '@accounts/account.repository'
import { PrismaService } from '@prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

describe('AccountRepository', () => {
  let accountRepository: AccountRepository
  let prisma: PrismaService

  const mockPrismaService = {
    accounts: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountRepository, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile()

    accountRepository = module.get<AccountRepository>(AccountRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new account', async () => {
      const accountData: Prisma.AccountCreateInput = {
        name: 'New Account'
      }
      const createdAccount = { id: 1, ...accountData }

      ;(prisma.accounts.create as jest.Mock).mockResolvedValue(createdAccount)

      const result = await accountRepository.create(accountData)
      expect(result).toEqual(createdAccount)
      expect(prisma.accounts.create).toHaveBeenCalledWith({ data: accountData })
    })
  })

  describe('update', () => {
    it('should update a account by ID', async () => {
      const accountData: Prisma.AccountUpdateInput = { name: 'Updated Account' }
      const updatedAccount = { id: 1, ...accountData }

      ;(prisma.accounts.update as jest.Mock).mockResolvedValue(updatedAccount)

      const result = await accountRepository.update(1, accountData)
      expect(result).toEqual(updatedAccount)
      expect(prisma.accounts.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: accountData
      })
    })

    it('should throw NotFoundException if account is not found', async () => {
      ;(prisma.accounts.update as jest.Mock).mockRejectedValue(new NotFoundException('Account not found'))

      await expect(accountRepository.update(1, {})).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a account by ID', async () => {
      const deletedAccount = { id: 1, name: 'Account to delete' }

      ;(prisma.accounts.delete as jest.Mock).mockResolvedValue(deletedAccount)

      const result = await accountRepository.delete(1)
      expect(result).toEqual(deletedAccount)
      expect(prisma.accounts.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException if account is not found', async () => {
      ;(prisma.accounts.delete as jest.Mock).mockRejectedValue(new NotFoundException('Account not found'))

      await expect(accountRepository.delete(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findMany', () => {
    it('should return a list of accounts', async () => {
      const accounts = [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' }
      ]
      const filter: Prisma.AccountFindManyArgs = { where: {} }

      ;(prisma.accounts.findMany as jest.Mock).mockResolvedValue(accounts)

      const result = await accountRepository.findMany(filter)
      expect(result).toEqual(accounts)
      expect(prisma.accounts.findMany).toHaveBeenCalledWith(filter)
    })
  })

  describe('getById', () => {
    it('should return a account by ID', async () => {
      const account = { id: 1, name: 'Account 1' }

      ;(prisma.accounts.findUnique as jest.Mock).mockResolvedValue(account)

      const result = await accountRepository.getById(1)
      expect(result).toEqual(account)
      expect(prisma.accounts.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should return null if account is not found', async () => {
      ;(prisma.accounts.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await accountRepository.getById(1)
      expect(result).toBeNull()
    })
  })

  describe('findUnique', () => {
    it('should return a unique account based on data', async () => {
      const account = { id: 1, name: 'Unique Account' }

      const filter: Prisma.AccountFindUniqueArgs = {
        where: {
          id: 1
        }
      }

      ;(prisma.accounts.findUnique as jest.Mock).mockResolvedValue(account)

      const result = await accountRepository.findUnique(filter)
      expect(result).toEqual(account)
      expect(prisma.accounts.findUnique).toHaveBeenCalledWith(filter)
    })
  })
})
