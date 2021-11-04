/** COMMON LIB */
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
import { query, Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ReserveTableService } from './reserve-table.service'

/** CONSTANTS */
import { MSG } from '@/constants/labels/errmsg'
import { FILE_TOPIC, OPERATOR } from '@/constants/reserve-table'
import { STATUS } from '@/constants/status'

/** CONSTANT (SORTING) */
import { PAGINATION } from '@/constants/pagination'
import { ORDERBY, TABLE_BOOKING_SORT } from '@/constants/sorting'
import { responseMessages } from '@/utils/response'

/** VALIDATOR */
import { ValidationPipe } from '@src/validation.pipe'
import { CREATE } from './reserve-table.schema'

/** ANOTHER LIB */
import { memoryStorage } from 'multer'
import { fileUpload, handleFileFields } from '@/utils/file'

/** UTILS */
import { genCode } from '@/utils/app'
import { beginTransaction, rollback, commit } from '@/databases/db_connection'
import {
  appendSpreadSheetValues,
  getGoogleSheetConnection,
  getValue,
  updateSpreadSheetValues
} from '@/utils/spreadsheet'
import { SHEET_NAME, USER_SPREAD_SHEET_ID, VALUE_INPUT_OPTION } from '@/constants/spreadsheet'

const storage = memoryStorage()

@Controller('reserve-table')
export class ReserveTableController {
  constructor(private readonly reserveTableService: ReserveTableService) {}

  @Get('')
  async findAll(@Req() req: any, @Res() res: Response, @Query() query) {
    try {
      /** FILTER */
      const { page, pageLimit, sort, sortBy, search } = query

      /** PAGINATION */
      const { STARTPAGE, PERPAGE } = await PAGINATION(page, pageLimit)

      /** SORTING */
      const { SORT_BY, SORT } = await ORDERBY(TABLE_BOOKING_SORT, sortBy, sort)
      const filter = {
        STARTPAGE,
        PERPAGE,
        SORT_BY: SORT_BY || TABLE_BOOKING_SORT.CREATEDAT,
        SORT,
        SEARCH: search,
        STATUS: STATUS.ACTIVE
      }

      const booking = await this.reserveTableService.findAll(filter)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, booking))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('/files')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'EVIDENCE', maxCount: 1 }], { storage }))
  async uploadFile(@Req() req: any, @Res() res: Response) {
    try {
      const uploaded = await fileUpload(FILE_TOPIC, await genCode(), req.files)
      const files = await handleFileFields(uploaded)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, files))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('')
  async create(@Req() req, @Res() res, @Param() param, @Body(new ValidationPipe(CREATE)) payload) {
    try {
      await beginTransaction()
      const filter = {
        restaurantCode: payload.restaurantCode,
        tableSize: payload.tableSize,
        status: STATUS.ACTIVE
      }
      const has_restaurant = await this.reserveTableService.findRestaurantByCode(filter)
      if (!has_restaurant) {
        await rollback()
        return res.status(StatusCodes.NOT_FOUND).json(responseMessages(StatusCodes.NOT_FOUND, MSG.RESTAURANT.NOT_FOUND))
      }
      if (!has_restaurant.tables.tableAmount) {
        await rollback()
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(responseMessages(StatusCodes.BAD_REQUEST, MSG.RESERVE_TABLE.FULL))
      }

      const {
        customerName,
        customerPhone,
        restaurantCode,
        tableSize,
        tableAmount,
        bookingDateTime,
        bookingMethod,
        files
      } = payload
      if (!files.length) {
        await rollback()
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(responseMessages(StatusCodes.NOT_FOUND, MSG.RESERVE_TABLE.EVIDENCE))
      }
      const booking_number = await genCode()
      payload.bookingNumber = booking_number
      delete payload.files
      const created = await this.reserveTableService.create(payload)

      for (const file of files) {
        file.restaurantTableBookingId = created.insertId
        file.bookingNumber = booking_number
        await this.reserveTableService.createReserveTableFile(file)
      }
      const update_table_amount = {
        restaurantCode: payload.restaurantCode,
        amount: payload.tableAmount,
        operator: OPERATOR.DECREASE
      }
      await this.reserveTableService.updateTableAmount(update_table_amount)
      await commit()

      const { googleSheets } = await getGoogleSheetConnection()
      await appendSpreadSheetValues({
        googleSheets,
        spreadsheetId: USER_SPREAD_SHEET_ID,
        range: SHEET_NAME.BOOKING,
        valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
        values: [
          [
            customerName,
            customerPhone,
            restaurantCode,
            tableSize,
            tableAmount,
            bookingDateTime,
            bookingMethod,
            booking_number,
            JSON.stringify(files),
            'NO',
            ''
          ]
        ]
      })

      return res.status(StatusCodes.CREATED).json(responseMessages(StatusCodes.CREATED, null))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Patch(':restaurant_code/return/:booking_id')
  async returnTable(@Req() req, @Res() res, @Param() param) {
    try {
      await beginTransaction()
      const { restaurant_code, booking_id } = param
      let filter = { booking_id, restaurant_code, status: STATUS.ACTIVE }
      const has_booking = await this.reserveTableService.findBookingByBookingId(filter)
      // if (!has_booking) {
      //   await rollback()
      //   return res
      //     .status(StatusCodes.NOT_FOUND)
      //     .json(responseMessages(StatusCodes.NOT_FOUND, MSG.RESERVE_TABLE.NOT_FOUND_HISTORY))
      // }

      // await this.reserveTableService.inactiveBooking({ booking_id, status: STATUS.INACTIVE })
      // await this.reserveTableService.updateTableAmount({
      //   restaurantCode: restaurant_code,
      //   amount: has_booking.tableAmount,
      //   operator: OPERATOR.INCREASE
      // })
      await commit()
      const { googleSheets } = await getGoogleSheetConnection()
      const result = await getValue({
        googleSheets,
        spreadsheetId: USER_SPREAD_SHEET_ID,
        range: `${SHEET_NAME.BOOKING}!A:K`
      })
      // await updateSpreadSheetValues({
      //   googleSheets,
      //   spreadsheetId: USER_SPREAD_SHEET_ID,
      //   range: `${SHEET_NAME.BOOKING}!I2`, //! may use get function for get range
      //   valueInputOption: VALUE_INPUT_OPTION.USER_ENTERED,
      //   values: [
      //     [
      //       '456456'
      //     ]
      //   ]
      // })
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null,result))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}
