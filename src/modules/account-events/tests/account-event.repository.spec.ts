import { Test, TestingModule } from '@nestjs/testing'
import { AccountEventRepository } from '@account-events/account-event.repository'
import { PrismaService } from '@prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

describe('AccountEventRepository', () => {
  let accountEventRepository: AccountEventRepository
  let prisma: PrismaService

  const mockPrismaService = {
    accountEvents: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountEventRepository, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile()

    accountEventRepository = module.get<AccountEventRepository>(AccountEventRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new accountEvent', async () => {
      const accountEventData: Prisma.AccountEventCreateInput = {
        name: 'New AccountEvent'
      }
      const createdAccountEvent = { id: 1, ...accountEventData }

      ;(prisma.accountEvents.create as jest.Mock).mockResolvedValue(createdAccountEvent)

      const result = await accountEventRepository.create(accountEventData)
      expect(result).toEqual(createdAccountEvent)
      expect(prisma.accountEvents.create).toHaveBeenCalledWith({ data: accountEventData })
    })
  })

  describe('update', () => {
    it('should update a accountEvent by ID', async () => {
      const accountEventData: Prisma.AccountEventUpdateInput = { name: 'Updated AccountEvent' }
      const updatedAccountEvent = { id: 1, ...accountEventData }

      ;(prisma.accountEvents.update as jest.Mock).mockResolvedValue(updatedAccountEvent)

      const result = await accountEventRepository.update(1, accountEventData)
      expect(result).toEqual(updatedAccountEvent)
      expect(prisma.accountEvents.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: accountEventData
      })
    })

    it('should throw NotFoundException if accountEvent is not found', async () => {
      ;(prisma.accountEvents.update as jest.Mock).mockRejectedValue(new NotFoundException('AccountEvent not found'))

      await expect(accountEventRepository.update(1, {})).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a accountEvent by ID', async () => {
      const deletedAccountEvent = { id: 1, name: 'AccountEvent to delete' }

      ;(prisma.accountEvents.delete as jest.Mock).mockResolvedValue(deletedAccountEvent)

      const result = await accountEventRepository.delete(1)
      expect(result).toEqual(deletedAccountEvent)
      expect(prisma.accountEvents.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should throw NotFoundException if accountEvent is not found', async () => {
      ;(prisma.accountEvents.delete as jest.Mock).mockRejectedValue(new NotFoundException('AccountEvent not found'))

      await expect(accountEventRepository.delete(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findMany', () => {
    it('should return a list of accountEvents', async () => {
      const accountEvents = [
        { id: 1, name: 'AccountEvent 1' },
        { id: 2, name: 'AccountEvent 2' }
      ]
      const filter: Prisma.AccountEventFindManyArgs = { where: {} }

      ;(prisma.accountEvents.findMany as jest.Mock).mockResolvedValue(accountEvents)

      const result = await accountEventRepository.findMany(filter)
      expect(result).toEqual(accountEvents)
      expect(prisma.accountEvents.findMany).toHaveBeenCalledWith(filter)
    })
  })

  describe('getById', () => {
    it('should return a accountEvent by ID', async () => {
      const accountEvent = { id: 1, name: 'AccountEvent 1' }

      ;(prisma.accountEvents.findUnique as jest.Mock).mockResolvedValue(accountEvent)

      const result = await accountEventRepository.getById(1)
      expect(result).toEqual(accountEvent)
      expect(prisma.accountEvents.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('should return null if accountEvent is not found', async () => {
      ;(prisma.accountEvents.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await accountEventRepository.getById(1)
      expect(result).toBeNull()
    })
  })

  describe('findUnique', () => {
    it('should return a unique accountEvent based on data', async () => {
      const accountEvent = { id: 1, name: 'Unique AccountEvent' }

      const filter: Prisma.AccountEventFindUniqueArgs = {
        where: {
          id: 1
        }
      }

      ;(prisma.accountEvents.findUnique as jest.Mock).mockResolvedValue(accountEvent)

      const result = await accountEventRepository.findUnique(filter)
      expect(result).toEqual(accountEvent)
      expect(prisma.accountEvents.findUnique).toHaveBeenCalledWith(filter)
    })
  })
})
