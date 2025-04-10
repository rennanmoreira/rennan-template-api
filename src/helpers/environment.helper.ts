export const isBoolean = (value: string | number | boolean): boolean =>
  value && ['true', '1'].includes(value?.toString()?.toLowerCase())
const getOrigins = (): string | string[] => {
  if (!process?.env?.ORIGIN) {
    throw new Error('Please set the ORIGIN environment variable to avoid security issues. Using default origins')
  }

  if (process?.env?.ORIGIN === '*') {
    process?.env?.NODE_ENV === 'production' &&
      console.warn(
        'Please set a specific ORIGIN for production to avoid security issues. Using * as origin to match all origins'
      )
    return '*'
  }

  if (process?.env?.ORIGIN?.length < 7) {
    process?.env?.NODE_ENV === 'production' &&
      console.warn(
        `Please set a valid ORIGIN. It requires at least 7 characters, received: ${process?.env?.ORIGIN}. Using default origins`
      )
    return process?.env?.ORIGIN
  }

  return process?.env?.ORIGIN.split(',')
}

export const IS_PRODUCTION = process?.env?.NODE_ENV === 'production'
export const IS_DEVELOPMENT = !IS_PRODUCTION
export const IS_SWAGGER_AUTH_ENABLED = isBoolean(process?.env?.FF_SWAGGER_AUTH_ENABLED)
export const IS_CLIENT_API_KEY_ENABLED = isBoolean(process?.env?.FF_CLIENT_API_KEY_ENABLED)
export const ORIGIN = getOrigins()
export const METHODS = process?.env?.METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
export const APP_VERSION = process?.env?.npm_package_version || '0.0.0'
export const APP_NAME = process?.env?.APP_NAME || 'rennan-api'
export const MAX_BODY_SIZE = process?.env?.MAX_BODY_SIZE || '1mb'
export const SWAGGER_USERNAME = process?.env?.SWAGGER_USERNAME || 'ADMIN'
export const SWAGGER_PASSWORD = process?.env?.SWAGGER_PASSWORD || new Date().getTime().toString()
export const FIREBASE_API_KEY = process?.env?.FIREBASE_API_KEY || ''
export const FIREBASE_AUTH_API = process?.env?.FIREBASE_AUTH_API || ''
export const FIREBASE_SERVICE_ACCOUNT = process?.env?.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process?.env?.FIREBASE_SERVICE_ACCOUNT)
  : {}
