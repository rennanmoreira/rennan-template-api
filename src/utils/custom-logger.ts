import { Logger, Injectable } from '@nestjs/common'

export const DEFAULT_COLOR = '#DDD'
export const DEFAULT_LOG_COLOR = '#8A2BE2'
export const DEFAULT_ERROR_COLOR = '#FF0000'
export const DEFAULT_WARN_COLOR = '#FFA500'

@Injectable()
export class CustomLogger extends Logger {
  private readonly color: string = DEFAULT_COLOR
  private readonly chalk = require('chalk')

  constructor(context: string, color?: string) {
    super(context)

    if (color) {
      this.color = color
    }
  }

  log(message: any, customColor: string = DEFAULT_LOG_COLOR) {
    const coloredMessage = this.chalk.hex(customColor)(message)
    super.log(coloredMessage)
  }

  error(message: any, customColor: string = DEFAULT_ERROR_COLOR) {
    const coloredMessage = this.chalk.hex(customColor)(message)
    super.error(coloredMessage)
  }

  warn(message: any, customColor: string = DEFAULT_WARN_COLOR) {
    const coloredMessage = this.chalk.hex(customColor)(message)
    super.warn(coloredMessage)
  }

  debug(message: any, customColor: string = this.color) {
    const coloredMessage = this.chalk.hex(customColor)(message)
    super.debug(coloredMessage)
  }

  verbose(message: any, customColor: string = this.color) {
    const coloredMessage = this.chalk.hex(customColor)(message)
    super.verbose(coloredMessage)
  }
}
