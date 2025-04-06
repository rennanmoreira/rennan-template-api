import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '@auth/controllers/auth.controller'
import { AuthService } from '@auth/services/auth.service'
import { ChangePasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from '@auth/dtos/auth.dto'
import { NotFoundException } from '@nestjs/common'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    changePassword: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
    getUserProfile: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return an access token', async () => {
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: '123456'
      }
      const token = { access_token: 'some_token' }

      mockAuthService.login.mockResolvedValue(token)

      const result = await authController.login(loginData)
      expect(result).toEqual(token)
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData)
    })
  })

  describe('signup', () => {
    it('should return an access token after signup', async () => {
      const registerData: RegisterDTO = {
        email: 'test@example.com',
        password: '123456',
        password_confirmation: '123456',
        people: {
          full_name: 'Test User',
          rg: '123456',
          cpf: '123456',
          email: 'test@example.com',
          birthday: new Date(),
          whatsapp: '123456',
          gender: 'M',
          phone: '123456'
        }
      }
      const token = { access_token: 'some_token' }

      mockAuthService.signup.mockResolvedValue(token)

      const result = await authController.signup(registerData)
      expect(result).toEqual(token)
      expect(mockAuthService.signup).toHaveBeenCalledWith(registerData)
    })
  })

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const changePasswordData: ChangePasswordDTO = {
        user_id: 1,
        password: 'oldPass123',
        new_password: 'newPass456',
        new_password_confirmation: 'newPass456'
      }

      await authController.changePassword(changePasswordData)
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(changePasswordData)
    })
  })

  describe('refresh', () => {
    it('should return a new access token', async () => {
      const refreshToken = 'refresh_token'
      const token = { access_token: 'new_access_token' }

      mockAuthService.refreshToken.mockResolvedValue(token)

      const result = await authController.refresh(refreshToken)
      expect(result).toEqual(token)
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken)
    })
  })

  describe('logout', () => {
    it('should call logout with refresh token', async () => {
      const refreshToken = 'refresh_token'

      await authController.logout(refreshToken)
      expect(mockAuthService.logout).toHaveBeenCalledWith(refreshToken)
    })
  })

  describe('resetPassword', () => {
    it('should reset the user password', async () => {
      const resetPasswordData: ResetPasswordDTO = {
        user_id: 1,
        password: 'newPassword123',
        password_confirmation: 'newPassword123',
        token: 'reset_token'
      }

      await authController.resetPassword(resetPasswordData)

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(resetPasswordData)
    })
  })

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userProfile = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      }
      const req = { user: { id: 1 } }

      mockAuthService.getUserProfile.mockResolvedValue(userProfile)

      const result = await authController.getProfile(req)
      expect(result).toEqual(userProfile)
      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(req.user.id)
    })

    it('should throw NotFoundException if user is not found', async () => {
      const req = { user: { id: 1 } }

      mockAuthService.getUserProfile.mockRejectedValue(new NotFoundException('User not found'))

      await expect(authController.getProfile(req)).rejects.toThrow(NotFoundException)
    })
  })
})
