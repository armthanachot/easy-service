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
import { RestaurantService } from './restaurant.service'
import { Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { responseMessages } from '@/utils/response'
import { MSG } from '@/constants/labels/errmsg'
import { ValidationPipe } from '../validation.pipe'
import { beginTransaction, commit, rollback } from '@/databases/db_connection'
import { STATUS } from '@/constants/status'
import { CREATE } from './restaurant.schema'
import { CreateRestaurantDto } from './dto/request/create-restaurant.dto'
import { PAGINATION } from '@/constants/pagination'
import { ORDERBY, RESTAURANT_SORT } from '@/constants/sorting'
import { DESTINATION_UNIT, LANGUAGE, TRAVEL_MODE } from '@/constants/google_map'

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Get()
  async findAll(@Req() req, @Res() res, @Query() query) {
    try {
      /** FILTER */
      const { page, pageLimit, sort, sortBy, search } = query

      /** PAGINATION */
      const { STARTPAGE, PERPAGE } = await PAGINATION(page, pageLimit)

      /** SORTING */
      const { SORT_BY, SORT } = await ORDERBY(RESTAURANT_SORT, sortBy, sort)

      const filter = {
        STARTPAGE,
        PERPAGE,
        SORT_BY: SORT_BY || RESTAURANT_SORT.CREATEDAT,
        SORT,
        SEARCH: search,
        STATUS: STATUS.ACTIVE,
      }
      const restaurants = await this.restaurantService.findAll(filter)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurants))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('/:restaurantId')
  async findById(@Req() req, @Res() res, @Param() param) {
    try {
      const { restaurantId } = param
      const filter = {
        restaurantId,
        status: STATUS.ACTIVE
      }
      const restaurant = await this.restaurantService.findById(filter)
      if (!restaurant)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(responseMessages(StatusCodes.NOT_FOUND, null, MSG.RESTAURANT.NOT_FOUND))
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurant))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('/nearest')
  async findNearestAll(@Req() req, @Res() res, @Query() query) {
    try {
      /** FILTER */
      const { search, origin, travelMode, language, unit, distance } = query

      const filter = {
        SEARCH: search,
        STATUS: STATUS.ACTIVE,
        ORIGIN: origin,
        TRAVEL_MODE: travelMode || TRAVEL_MODE.DRIVING,
        LANGUAGE: language || LANGUAGE.EN,
        UNITS: unit || DESTINATION_UNIT.METRIC,
        LIMIT_DISTANCE: distance || 1000 //m.
      }
      const restaurants = await this.restaurantService.findNearestRestaurant(filter)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurants))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('')
  async create(@Req() req, @Res() res, @Body(new ValidationPipe(CREATE)) payload: CreateRestaurantDto) {
    try {
      await beginTransaction()
      const { labors, services, tables, bestSellers } = payload
      delete payload.labors
      delete payload.services
      delete payload.tables
      delete payload.bestSellers
      const restaurantCode = await this.restaurantService.create(payload)
      if (labors.length) {
        for (const labor of labors) {
          labor.restaurantCode = restaurantCode
          const created = await this.restaurantService.createRestaurantLabor(labor)
        }
      }
      if (services.length) {
        for (const service of services) {
          service.restaurantCode = restaurantCode
          const created = await this.restaurantService.createRestaurantService(service)
        }
      }
      if (tables.length) {
        for (const table of tables) {
          table.restaurantCode = restaurantCode
          const created = await this.restaurantService.createRestaurantTable(table)
        }
      }
      if (bestSellers.length) {
        for (const bestSeller of bestSellers) {
          bestSeller.restaurantCode = restaurantCode
          const created = await this.restaurantService.createRestaurantBestSeller(bestSeller)
        }
      }
      await commit()
      return res.status(StatusCodes.CREATED).json(responseMessages(StatusCodes.CREATED))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}
