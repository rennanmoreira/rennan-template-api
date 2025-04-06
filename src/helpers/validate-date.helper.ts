import { isISO8601 } from 'class-validator'

export const validateDate = (date: string, field: string): Date => {
  if (date) {
    const isValidDate = isISO8601(date, {
      strict: true
    })
    if (!isValidDate) {
      throw new Error(`Property "${field}" should be a valid ISO8601 date string`)
    }
    return new Date(date)
  }

  throw new Error(`Property "${field}" is required`)
}
