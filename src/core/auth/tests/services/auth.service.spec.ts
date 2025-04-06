import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '@auth/services/auth.service'
import { UserService } from '@users/services/user.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { Users } from '@prisma/client'
import { ChangePasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from '@auth/dtos/auth.dto'

jest.mock('bcryptjs')

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let jwtService: JwtService

  const mockUserService = {
    findByEmail: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn()
  }

  const mockUser: Users = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    token_version: 1,
    refresh_token: 'old_refresh_token',
    created_at: new Date(),
    updated_at: new Date()
  } as Users

  const mockDecodedToken = { sub: 1 }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)

    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should log in the user successfully', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' }
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        token_version: 1
      }

      const accessToken = 'access_token'
      const refreshToken = 'refresh_token'

      mockUserService.findByEmail.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await authService.login(loginDto)

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        refresh_token: refreshToken,
        token_version: mockUser.token_version + 1
      })
    })
  })

  describe('refreshToken', () => {
    it('should refresh the token successfully', async () => {
      const oldRefreshToken = 'old_refresh_token'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        token_version: 1,
        refresh_token: oldRefreshToken
      }

      const newAccessToken = 'new_access_token'
      const newRefreshToken = 'new_refresh_token'

      // Mock dos serviços e funções
      mockJwtService.decode.mockReturnValue({
        sub: mockUser.id,
        token_version: mockUser.token_version
      })
      mockUserService.getById.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValueOnce(newAccessToken).mockReturnValueOnce(newRefreshToken)

      const result = await authService.refreshToken(oldRefreshToken)

      expect(result).toEqual({
        access_token: newAccessToken,
        refresh_token: newRefreshToken
      })

      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        refresh_token: newRefreshToken
      })
    })

    it('should throw UnauthorizedException if token is invalid', async () => {
      const oldRefreshToken = 'invalid_token'

      mockJwtService.decode.mockReturnValue(null)

      await expect(authService.refreshToken(oldRefreshToken)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if user is not found', async () => {
      const oldRefreshToken = 'old_refresh_token'

      mockJwtService.decode.mockReturnValue({ sub: 1 })
      mockUserService.getById.mockResolvedValue(null)

      await expect(authService.refreshToken(oldRefreshToken)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const oldRefreshToken = 'old_refresh_token'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        token_version: 1,
        refresh_token: 'different_refresh_token'
      }

      mockJwtService.decode.mockReturnValue({
        sub: mockUser.id,
        token_version: mockUser.token_version
      })
      mockUserService.getById.mockResolvedValue(mockUser)

      await expect(authService.refreshToken(oldRefreshToken)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('changePassword', () => {
    it('should change the password successfully', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password')
      mockUserService.getById.mockResolvedValue(mockUser)

      const changePasswordDto: ChangePasswordDTO = {
        user_id: 1,
        password: 'old_password',
        new_password: 'new_password',
        new_password_confirmation: 'new_password'
      }

      await authService.changePassword(changePasswordDto)

      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'new_hashed_password',
        refresh_token: null
      })
    })

    it('should throw UnauthorizedException for invalid user', async () => {
      mockUserService.getById.mockResolvedValue(null)

      await expect(
        authService.changePassword({
          user_id: 1,
          password: 'old_password',
          new_password: 'new_password',
          new_password_confirmation: 'new_password'
        })
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for incorrect password', async () => {
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
      mockUserService.getById.mockResolvedValue(mockUser)

      await expect(
        authService.changePassword({
          user_id: 1,
          password: 'wrong_password',
          new_password: 'new_password',
          new_password_confirmation: 'new_password'
        })
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('resetPassword', () => {
    let resetPasswordData: ResetPasswordDTO

    beforeEach(() => {
      resetPasswordData = {
        user_id: 1,
        password: 'new_password',
        password_confirmation: 'new_password',
        token: 'valid_token'
      }
    })

    it('should reset the user password if token and confirmation are valid', async () => {
      mockUserService.getById.mockResolvedValue(mockUser)
      mockJwtService.decode.mockReturnValue(mockDecodedToken)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password')

      await authService.resetPassword(resetPasswordData)

      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'new_hashed_password',
        refresh_token: null,
        token_version: mockUser.token_version + 1
      })
    })

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockUserService.getById.mockResolvedValue(null)

      await expect(authService.resetPassword(resetPasswordData)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password and confirmation do not match', async () => {
      resetPasswordData.password_confirmation = 'different_password'

      await expect(authService.resetPassword(resetPasswordData)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockJwtService.decode.mockReturnValue(null)

      await expect(authService.resetPassword(resetPasswordData)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if token user ID does not match provided user ID', async () => {
      mockJwtService.decode.mockReturnValue({ sub: 2 })

      await expect(authService.resetPassword(resetPasswordData)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('should logout the user successfully', async () => {
      const mockDecodedToken = {
        sub: 1,
        token_version: 1
      }

      const expectedUpdateData = {
        refresh_token: null,
        token_version: mockDecodedToken.token_version + 1
      }

      mockJwtService.decode.mockReturnValue(mockDecodedToken)

      await authService.logout('refresh_token')

      expect(mockUserService.update).toHaveBeenCalledWith(mockDecodedToken.sub, expectedUpdateData)
    })

    it('should not call update if the token is invalid', async () => {
      mockJwtService.decode.mockReturnValue(null)

      await authService.logout('invalid_token')

      expect(mockUserService.update).not.toHaveBeenCalled()
    })
  })
})
