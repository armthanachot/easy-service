import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { responseMessages } from '@/utils/response'
import { verifyToken } from '@/utils/auth'
import { AuthModel } from '../src/auth/auth.model'
const authModel = new AuthModel()

@Injectable()
export class permissionVerify implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    if (!authorization)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(await responseMessages(StatusCodes.UNAUTHORIZED, 'INVALID_AUTHENTICATION'))
    const [tokenType, token] = authorization.split(' ')
    const validToken: any = await verifyToken(token)
    if (validToken.message)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(await responseMessages(StatusCodes.UNAUTHORIZED, validToken.message))
    validToken.token = token
    const lastToken = await authModel.findJWTToken(validToken)
    if (!lastToken.length)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(await responseMessages(StatusCodes.UNAUTHORIZED, 'SESSION_EXPIRED'))
    const { userCode, email, userRole } = validToken
    Object.assign(req, { userCode, email, userRole })
    next()
  }
}
