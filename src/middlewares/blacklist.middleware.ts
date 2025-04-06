import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express' // TODO: test if this will work

@Injectable()
export class BlackListMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/health') {
      return next()
    }

    const blacklistedIps = process.env?.BLACKLISTED_IPS?.split(',') || []

    let clientIp = req.ip

    if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.replace('::ffff:', '')
    }

    if (blacklistedIps?.includes(clientIp)) {
      return res.status(403).json({
        message: 'Access denied. Your IP is blocked.'
      })
    }

    next()
  }
}
