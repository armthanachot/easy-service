import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Req,
  Res,
  Body,
  Query,
  UsePipes,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserSignupDto } from './dto/request/signup.dto'
import { responseMessages } from '../../utils/response'
import { generateJWT, passwordHash, verifyPassword } from '@/utils/auth'
import { MSG } from '@/constants/labels/errmsg'
import { SIGNUP } from './auth.schema'
import { ValidationPipe } from '../validation.pipe'
import { beginTransaction, commit, rollback } from '@/databases/db_connection'
import { genCode } from '@/utils/app'
import { UserLoginDto } from './dto/request/login.dto'
import { STATUS } from '@/constants/status'
import { SHEET_NAME, USER_SPREAD_SHEET_ID, VALUE_INPUT_OPTION } from '@/constants/spreadsheet'
import {
  auth,
  getGoogleSheetConnection,
  getSpreadSheetMetaData,
  getGoogleSheetRows,
  appendSpreadSheetValues
} from '@/utils/spreadsheet'
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Req() req, @Res() res: Response, @Body(new ValidationPipe(SIGNUP)) payload: UserSignupDto) {
    try {
      await beginTransaction()
      if (payload.password !== payload.confirmPassword)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(responseMessages(StatusCodes.BAD_REQUEST, MSG.AUTH.PASSWORD_NOT_MATCH))
      const { salt, encrypted } = await passwordHash(payload.password)
      delete payload.confirmPassword
      payload.password = encrypted
      payload.salt = salt
      payload.userCode = genCode()
      await this.authService.signup(payload)
      const { googleSheets } = await getGoogleSheetConnection()
      const { email, fullName, userName, userRole } = payload
      await appendSpreadSheetValues({
        googleSheets,
        spreadsheetId: USER_SPREAD_SHEET_ID,
        range: SHEET_NAME.USER,
        valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
        values: [[email, fullName, userName, userRole]]
      })
      await commit()
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('/login')
  async login(@Req() req, @Res() res: Response, @Body() payload: UserLoginDto) {
    try {
      await beginTransaction()
      payload.status = STATUS.ACTIVE
      const user = await this.authService.findUserByEmail(payload)
      const { userId, userCode, email, userRole, password: userPassword, salt } = user
      const logedin = await verifyPassword(`${payload.password + salt}`, userPassword)
      if (!logedin)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(responseMessages(StatusCodes.BAD_REQUEST, null, MSG.AUTH.USER_PASSWORD_INVALID))
      const token_payload = { userCode, email, userRole }
      const { token } = await generateJWT(token_payload)
      await this.authService.updateToken({ userId, token })
      await commit()
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, token))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}
