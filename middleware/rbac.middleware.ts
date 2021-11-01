import { Request, Response, NextFunction } from 'express'
import { responseMessages } from '@/utils/response'
import { StatusCodes } from 'http-status-codes'

const rbac = async (role: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!role.includes(req.userRole))
      return res.status(StatusCodes.FORBIDDEN).json(await responseMessages(StatusCodes.FORBIDDEN, 'PERMISSION DENIED'))

    return next()
  }
}

export { rbac }
