import { FIREBASE_API_KEY, FIREBASE_AUTH_API, FIREBASE_SERVICE_ACCOUNT } from '@helpers/environment.helper'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
  private firebaseAuthAPI: AxiosInstance
  private readonly logger = new Logger(FirebaseService.name)

  constructor() {
    admin.initializeApp({ credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT) }) // storageBucket: process.env.FIREBASE_STORAGE_BUCKET

    this.firebaseAuthAPI = axios.create({ baseURL: FIREBASE_AUTH_API, params: { key: FIREBASE_API_KEY } })
  }

  async register(email: string, password: string) {
    try {
      const response = await this.firebaseAuthAPI.post(`/accounts:signUp`, {
        email,
        password,
        returnSecureToken: true
      })

      return response.data
    } catch (error) {
      if (error instanceof axios.AxiosError)
        throw new Error(error.response?.data?.error?.message || 'Erro ao registrar no Firebase')

      if (error instanceof Error) throw new Error(error.message)

      throw new Error('Erro ao registrar no Firebase: ' + error.toString())
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.firebaseAuthAPI.post(`/accounts:signInWithPassword`, {
        email,
        password,
        returnSecureToken: true
      })

      return response.data
    } catch (error) {
      if (error instanceof axios.AxiosError)
        throw new Error(error.response?.data?.error?.message || 'Erro ao autenticar no Firebase')

      if (error instanceof Error) throw new Error(error.message)

      throw new Error('Erro ao autenticar no Firebase: ' + error.toString())
    }
  }

  async loginWithLink(email: string, base_url: string): Promise<{ url: string }> {
    try {
      const url = await admin.auth().generateSignInWithEmailLink(email, {
        url: `${base_url}/login?email=${email}`
      })

      return { url }
    } catch (error) {
      if (error instanceof axios.AxiosError)
        throw new Error(error.response?.data?.error?.message || 'Erro ao gerar o link de autenticação no Firebase')

      if (error instanceof Error) throw new Error(error.message)

      throw new Error('Erro ao gerar o link de autenticação no Firebase: ' + error.toString())
    }
  }

  async getUserByUid(uid: string) {
    return admin.auth().getUser(uid)
  }

  async getUserByEmail(email: string) {
    try {
      return admin.auth().getUserByEmail(email)
    } catch (error) {
      throw new Error('Error listing users')
    }
  }

  async getUserByToken(token: string) {
    const decodedToken = await this.getDecodedToken(token)
    return admin.auth().getUser(decodedToken.uid)
  }

  async getDecodedToken(token: string) {
    return admin.auth().verifyIdToken(token)
  }

  // async updateUser(uid: string, updateData: { displayName?: string; photoURL?: string }) {
  //   try {
  //     const userRecord = await admin.auth().updateUser(uid, updateData)
  //     return userRecord
  //   } catch (error) {
  //     this.logger.error('[updateUser] ' + error, error)
  //     throw new Error('Erro ao atualizar o usuário')
  //   }
  // }

  // async deleteUser(uid: string) {
  //   try {
  //     await admin.auth().deleteUser(uid)
  //     return { message: 'Usuário excluído com sucesso' }
  //   } catch (error) {
  //     this.logger.error('[deleteUser] ' + error, error)
  //     throw new Error('Erro ao excluir o usuário')
  //   }
  // }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     const response = await this.firebaseAuthAPI.post('/token', {
  //       grant_type: 'refresh_token',
  //       refresh_token: refreshToken
  //     })
  //     // return camelizeKeys(response.data)
  //     return response.data
  //   } catch (error) {
  //     this.logger.error('[refreshToken] ' + error, error)
  //     console.log(error.message)
  //     throw this.handleTokenUnauthorizedError(error)
  //   }
  // }

  // async resetPassword(email: string) {
  //   try {
  //     const response = await this.firebaseAuthAPI.post('/accounts:sendOobCode', {
  //       requestType: 'PASSWORD_RESET',
  //       email
  //     })
  //     return response.data
  //   } catch (error) {
  //     this.logger.error('[resetPassword] ' + error, error)
  //     console.log(error.message)
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_ACCEPTABLE,
  //         error: error.message
  //       },
  //       HttpStatus.NOT_ACCEPTABLE,
  //       {
  //         cause: error
  //       }
  //     )
  //   }
  // }

  // async confirmResetPassword(oobCode: string, newPassword: string) {
  //   try {
  //     const response = await this.firebaseAuthAPI.post('/accounts:resetPassword', {
  //       oobCode,
  //       newPassword
  //     })
  //     return response.data
  //   } catch (error) {
  //     this.logger.error('[confirmResetPassword] ' + error, error)
  //     console.log(error.message)
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         error: 'Código inválido',
  //         server: error.message
  //       },
  //       HttpStatus.BAD_REQUEST,
  //       {
  //         cause: error
  //       }
  //     )
  //   }
  // }

  // async setCustomUserClaims(userId: string, role: Role) {
  //   try {
  //     const claims = {
  //       role
  //     }
  //     const result = await admin.auth().setCustomUserClaims(userId, claims)

  //     return result
  //   } catch (error) {
  //     this.logger.error('[setCustomUserClaims] ' + error, error)
  //     console.log(error.message)
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_REQUEST,
  //         error: 'Erro ao criar usuário',
  //         server: error.message
  //       },
  //       HttpStatus.BAD_REQUEST,
  //       {
  //         cause: error
  //       }
  //     )
  //   }
  // }
}
