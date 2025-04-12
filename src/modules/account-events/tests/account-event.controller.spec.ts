import { Test, TestingModule } from '@nestjs/testing'
import { AccountEventController } from '@account-events/account-event.controller'
import { AccountEventService } from '@account-events/account-event.service'
import { CreateAccountEventDTO, UpdateAccountEventDTO } from '@account-events/account-event.dto'
import { NotFoundException } from '@nestjs/common'

describe('AccountEventController', () => {
  let accountEventController: AccountEventController
  let accountEventService: AccountEventService

  const mockAccountEventService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountEventController],
      providers: [
        {
          provide: AccountEventService,
          useValue: mockAccountEventService
        }
      ]
    }).compile()

    accountEventController = module.get<AccountEventController>(AccountEventController)
    accountEventService = module.get<AccountEventService>(AccountEventService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new accountEvent', async () => {
      const accountEventData: CreateAccountEventDTO = {
        name: 'New AccountEvent'
      }
      const createdAccountEvent = { id: 1, ...accountEventData }

      mockAccountEventService.create.mockResolvedValue(createdAccountEvent)

      const result = await accountEventController.create(accountEventData)
      expect(result).toEqual(createdAccountEvent)
      expect(mockAccountEventService.create).toHaveBeenCalledWith(accountEventData)
    })
  })

  describe('getAll', () => {
    it('should return a list of accountEvents', async () => {
      const accountEvents = [
        { id: 1, name: 'AccountEvent 1' },
        { id: 2, name: 'AccountEvent 2' }
      ]

      mockAccountEventService.getAll.mockResolvedValue(accountEvents)

      const page = 1
      const offset = 10
      const filters = { name: 'AccountEvent' }

      const result = await accountEventController.getAll(page, offset, filters)
      expect(result).toEqual(accountEvents)
      expect(mockAccountEventService.getAll).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return a accountEvent by ID', async () => {
      const accountEvent = { id: 1, name: 'AccountEvent 1' }

      mockAccountEventService.getById.mockResolvedValue(accountEvent)

      const result = await accountEventController.getById(1)
      expect(result).toEqual(accountEvent)
      expect(mockAccountEventService.getById).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException if accountEvent is not found', async () => {
      mockAccountEventService.getById.mockRejectedValue(new NotFoundException('AccountEvent not found'))

      await expect(accountEventController.getById(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a accountEvent by ID', async () => {
      const accountEventData: UpdateAccountEventDTO = { name: 'Updated AccountEvent' }
      const updatedAccountEvent = { id: 1, ...accountEventData }

      mockAccountEventService.update.mockResolvedValue(updatedAccountEvent)

      const result = await accountEventController.update(1, accountEventData)
      expect(result).toEqual(updatedAccountEvent)
      expect(mockAccountEventService.update).toHaveBeenCalledWith(1, accountEventData)
    })

    it('should throw NotFoundException if accountEvent is not found during update', async () => {
      const accountEventData: UpdateAccountEventDTO = { name: 'Updated AccountEvent' }

      mockAccountEventService.update.mockRejectedValue(new NotFoundException('AccountEvent not found'))

      await expect(accountEventController.update(1, accountEventData)).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a accountEvent by ID', async () => {
      const deletedAccountEvent = { id: 1, name: 'AccountEvent to delete' }

      mockAccountEventService.delete.mockResolvedValue(deletedAccountEvent)

      const result = await accountEventController.delete(1)
      expect(result).toEqual(deletedAccountEvent)
      expect(mockAccountEventService.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException if accountEvent is not found during delete', async () => {
      mockAccountEventService.delete.mockRejectedValue(new NotFoundException('AccountEvent not found'))

      await expect(accountEventController.delete(1)).rejects.toThrow(NotFoundException)
    })
  })
})
