import { Test, TestingModule } from '@nestjs/testing'
import { AccountController } from '@accounts/account.controller'
import { AccountService } from '@accounts/account.service'
import { CreateAccountDTO, UpdateAccountDTO } from '@accounts/account.dto'
import { NotFoundException } from '@nestjs/common'

describe('AccountController', () => {
  let accountController: AccountController
  let accountService: AccountService

  const mockAccountService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService
        }
      ]
    }).compile()

    accountController = module.get<AccountController>(AccountController)
    accountService = module.get<AccountService>(AccountService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new account', async () => {
      const accountData: CreateAccountDTO = {
        name: 'New Account'
      }
      const createdAccount = { id: 1, ...accountData }

      mockAccountService.create.mockResolvedValue(createdAccount)

      const result = await accountController.create(accountData)
      expect(result).toEqual(createdAccount)
      expect(mockAccountService.create).toHaveBeenCalledWith(accountData)
    })
  })

  describe('getAll', () => {
    it('should return a list of accounts', async () => {
      const accounts = [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' }
      ]

      mockAccountService.getAll.mockResolvedValue(accounts)

      const page = 1
      const offset = 10
      const filters = { name: 'Account' }

      const result = await accountController.getAll(page, offset, filters)
      expect(result).toEqual(accounts)
      expect(mockAccountService.getAll).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return a account by ID', async () => {
      const account = { id: 1, name: 'Account 1' }

      mockAccountService.getById.mockResolvedValue(account)

      const result = await accountController.getById(1)
      expect(result).toEqual(account)
      expect(mockAccountService.getById).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException if account is not found', async () => {
      mockAccountService.getById.mockRejectedValue(new NotFoundException('Account not found'))

      await expect(accountController.getById(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a account by ID', async () => {
      const accountData: UpdateAccountDTO = { name: 'Updated Account' }
      const updatedAccount = { id: 1, ...accountData }

      mockAccountService.update.mockResolvedValue(updatedAccount)

      const result = await accountController.update(1, accountData)
      expect(result).toEqual(updatedAccount)
      expect(mockAccountService.update).toHaveBeenCalledWith(1, accountData)
    })

    it('should throw NotFoundException if account is not found during update', async () => {
      const accountData: UpdateAccountDTO = { name: 'Updated Account' }

      mockAccountService.update.mockRejectedValue(new NotFoundException('Account not found'))

      await expect(accountController.update(1, accountData)).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a account by ID', async () => {
      const deletedAccount = { id: 1, name: 'Account to delete' }

      mockAccountService.delete.mockResolvedValue(deletedAccount)

      const result = await accountController.delete(1)
      expect(result).toEqual(deletedAccount)
      expect(mockAccountService.delete).toHaveBeenCalledWith(1)
    })

    it('should throw NotFoundException if account is not found during delete', async () => {
      mockAccountService.delete.mockRejectedValue(new NotFoundException('Account not found'))

      await expect(accountController.delete(1)).rejects.toThrow(NotFoundException)
    })
  })
})
