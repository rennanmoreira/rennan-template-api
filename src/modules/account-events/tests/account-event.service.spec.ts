import { Test, TestingModule } from '@nestjs/testing'
import { AccountEventService } from '@account-events/account-event.service'
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common'
// import { IAccountEventRepository } from '@accountEvents/interfaces/repositories/account-event.interface';
import {
  CreateAccountEventDTO,
  UpdateAccountEventDTO,
  FilterAccountEventDTO
} from '@accountEvents/dtos/account-event.dto'
import { Prisma, AccountEvent } from '@prisma/client'

describe('AccountEventService', () => {
  let accountEventService: AccountEventService
  let accountEventRepository: jest.Mocked<IAccountEventRepository>

  const mockAccountEventRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountEventService, { provide: IAccountEventRepository, useValue: mockAccountEventRepository }]
    }).compile()

    accountEventService = module.get<AccountEventService>(AccountEventService)
    accountEventRepository = module.get<IAccountEventRepository>(
      IAccountEventRepository
    ) as jest.Mocked<IAccountEventRepository>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new accountEvent', async () => {
      const accountEventData: CreateAccountEventDTO = {
        name: 'New AccountEvent'
      }

      const createdAccountEvent: any = {
        id: 1,
        ...accountEventData
      }

      accountEventRepository.create.mockResolvedValue(createdAccountEvent)

      const result = await accountEventService.create(accountEventData)
      expect(result).toEqual(createdAccountEvent)
      expect(accountEventRepository.create).toHaveBeenCalledWith({
        name: accountEventData.name
      })
    })

    it('should throw a ConflictException if accountEvent already exists', async () => {
      const accountEventData: CreateAccountEventDTO = {
        name: 'Existing AccountEvent'
      }
      accountEventRepository.create.mockRejectedValue({ code: 'P2002' })

      await expect(accountEventService.create(accountEventData)).rejects.toThrow(ConflictException)
    })
  })

  describe('getAll', () => {
    it('should return a list of accountEvents', async () => {
      const accountEvents = [
        { id: 1, name: 'AccountEvent 1' },
        { id: 2, name: 'AccountEvent 2' }
      ]

      const filter: Prisma.AccountEventFindManyArgs = {
        skip: 0,
        take: 10,
        where: {},
        orderBy: { created_at: 'desc' }
      }

      accountEventRepository.findMany.mockResolvedValue(accountEvents as AccountEvent[])

      const result = await accountEventService.getAll({
        page: 1,
        offset: 10,
        filters: {}
      })
      expect(result).toEqual(accountEvents)
      expect(accountEventRepository.findMany).toHaveBeenCalledWith(filter)
    })

    it('should apply filters correctly', async () => {
      const accountEvents = [{ id: 1, name: 'Filtered AccountEvent' }]
      const filters: FilterAccountEventDTO = { name: 'Filtered' }
      const filterConfig = {
        skip: 0,
        take: 10,
        where: {
          name: { contains: 'Filtered' }
        },
        orderBy: { created_at: 'desc' }
      }

      accountEventRepository.findMany.mockResolvedValue(accountEvents as AccountEvent[])

      const result = await accountEventService.getAll({
        page: 1,
        offset: 10,
        filters
      })

      expect(result).toEqual(accountEvents)
      expect(accountEventRepository.findMany).toHaveBeenCalledWith(filterConfig)
    })
  })

  describe('getById', () => {
    it('should return a accountEvent by ID', async () => {
      const accountEvent = { id: 1, name: 'AccountEvent 1' }

      accountEventRepository.getById.mockResolvedValue(accountEvent as AccountEvent)

      const result = await accountEventService.getById(1)
      expect(result).toEqual(accountEvent)
      expect(accountEventRepository.getById).toHaveBeenCalledWith(1)
    })

    it('should throw a NotFoundException if accountEvent is not found', async () => {
      accountEventRepository.getById.mockResolvedValue(null)

      await expect(accountEventService.getById(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a accountEvent', async () => {
      const updateAccountEventDto: UpdateAccountEventDTO = {
        name: 'Updated AccountEvent'
      }
      const updatedAccountEvent = { id: 1, ...updateAccountEventDto }

      accountEventRepository.update.mockResolvedValue(updatedAccountEvent as AccountEvent)

      const result = await accountEventService.update(1, updateAccountEventDto)
      expect(result).toEqual(updatedAccountEvent)
      expect(accountEventRepository.update).toHaveBeenCalledWith(1, updateAccountEventDto)
    })

    it('should throw a NotFoundException if accountEvent not found', async () => {
      accountEventRepository.update.mockRejectedValue({ code: 'P2025' })

      await expect(accountEventService.update(1, {} as UpdateAccountEventDTO)).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a accountEvent', async () => {
      const accountEvent = { id: 1, name: 'AccountEvent to delete' }

      accountEventRepository.delete.mockResolvedValue(accountEvent)

      const result = await accountEventService.delete(1)
      expect(result).toEqual(accountEvent)
      expect(accountEventRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw a NotFoundException if accountEvent is not found', async () => {
      accountEventRepository.delete.mockRejectedValue({ code: 'P2025' })

      await expect(accountEventService.delete(1)).rejects.toThrow(NotFoundException)
    })

    it('should throw InternalServerErrorException if accountEvent cannot be deleted', async () => {
      accountEventRepository.delete.mockRejectedValue({ code: 'P2020' })

      await expect(accountEventService.delete(1)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
