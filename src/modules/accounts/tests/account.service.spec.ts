import { Test, TestingModule } from '@nestjs/testing'
import { AccountService } from '@accounts/account.service'
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common'
// import { IAccountRepository } from '@accounts/interfaces/repositories/account.interface';
import { CreateAccountDTO, UpdateAccountDTO, FilterAccountDTO } from '@accounts/dtos/account.dto'
import { Prisma, Account } from '@prisma/client'

describe('AccountService', () => {
  let accountService: AccountService
  let accountRepository: jest.Mocked<IAccountRepository>

  const mockAccountRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, { provide: IAccountRepository, useValue: mockAccountRepository }]
    }).compile()

    accountService = module.get<AccountService>(AccountService)
    accountRepository = module.get<IAccountRepository>(IAccountRepository) as jest.Mocked<IAccountRepository>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new account', async () => {
      const accountData: CreateAccountDTO = {
        name: 'New Account'
      }

      const createdAccount: any = {
        id: 1,
        ...accountData
      }

      accountRepository.create.mockResolvedValue(createdAccount)

      const result = await accountService.create(accountData)
      expect(result).toEqual(createdAccount)
      expect(accountRepository.create).toHaveBeenCalledWith({
        name: accountData.name
      })
    })

    it('should throw a ConflictException if account already exists', async () => {
      const accountData: CreateAccountDTO = {
        name: 'Existing Account'
      }
      accountRepository.create.mockRejectedValue({ code: 'P2002' })

      await expect(accountService.create(accountData)).rejects.toThrow(ConflictException)
    })
  })

  describe('getAll', () => {
    it('should return a list of accounts', async () => {
      const accounts = [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' }
      ]

      const filter: Prisma.AccountFindManyArgs = {
        skip: 0,
        take: 10,
        where: {},
        orderBy: { created_at: 'desc' }
      }

      accountRepository.findMany.mockResolvedValue(accounts as Account[])

      const result = await accountService.getAll({
        page: 1,
        offset: 10,
        filters: {}
      })
      expect(result).toEqual(accounts)
      expect(accountRepository.findMany).toHaveBeenCalledWith(filter)
    })

    it('should apply filters correctly', async () => {
      const accounts = [{ id: 1, name: 'Filtered Account' }]
      const filters: FilterAccountDTO = { name: 'Filtered' }
      const filterConfig = {
        skip: 0,
        take: 10,
        where: {
          name: { contains: 'Filtered' }
        },
        orderBy: { created_at: 'desc' }
      }

      accountRepository.findMany.mockResolvedValue(accounts as Account[])

      const result = await accountService.getAll({
        page: 1,
        offset: 10,
        filters
      })

      expect(result).toEqual(accounts)
      expect(accountRepository.findMany).toHaveBeenCalledWith(filterConfig)
    })
  })

  describe('getById', () => {
    it('should return a account by ID', async () => {
      const account = { id: 1, name: 'Account 1' }

      accountRepository.getById.mockResolvedValue(account as Account)

      const result = await accountService.getById(1)
      expect(result).toEqual(account)
      expect(accountRepository.getById).toHaveBeenCalledWith(1)
    })

    it('should throw a NotFoundException if account is not found', async () => {
      accountRepository.getById.mockResolvedValue(null)

      await expect(accountService.getById(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('should update a account', async () => {
      const updateAccountDto: UpdateAccountDTO = {
        name: 'Updated Account'
      }
      const updatedAccount = { id: 1, ...updateAccountDto }

      accountRepository.update.mockResolvedValue(updatedAccount as Account)

      const result = await accountService.update(1, updateAccountDto)
      expect(result).toEqual(updatedAccount)
      expect(accountRepository.update).toHaveBeenCalledWith(1, updateAccountDto)
    })

    it('should throw a NotFoundException if account not found', async () => {
      accountRepository.update.mockRejectedValue({ code: 'P2025' })

      await expect(accountService.update(1, {} as UpdateAccountDTO)).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should delete a account', async () => {
      const account = { id: 1, name: 'Account to delete' }

      accountRepository.delete.mockResolvedValue(account)

      const result = await accountService.delete(1)
      expect(result).toEqual(account)
      expect(accountRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw a NotFoundException if account is not found', async () => {
      accountRepository.delete.mockRejectedValue({ code: 'P2025' })

      await expect(accountService.delete(1)).rejects.toThrow(NotFoundException)
    })

    it('should throw InternalServerErrorException if account cannot be deleted', async () => {
      accountRepository.delete.mockRejectedValue({ code: 'P2020' })

      await expect(accountService.delete(1)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
