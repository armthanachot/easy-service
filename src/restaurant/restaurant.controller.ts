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
import { RestaurantService } from './restaurant.service'
import { Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

/** UTILS */
import { responseMessages } from '@/utils/response'
import { genCode, removeUselessKey } from '@/utils/app'

/** PIPE | SCHEMA */
import { CREATE } from './restaurant.schema'
import { ValidationPipe } from '../validation.pipe'

/** DB OPTION */
import { beginTransaction, commit, rollback } from '@/databases/db_connection'

/** CONSTANTS */
import { MSG } from '@/constants/labels/errmsg'
import { STATUS } from '@/constants/status'
import { DESTINATION_UNIT, LANGUAGE, NEAREST_DISTANCE, TRAVEL_MODE } from '@/constants/google_map'
import { FILE_TOPIC, USELESS_KEYS } from '@/constants/restaurant'

/** CONSTANT (SORTING) */
import { PAGINATION } from '@/constants/pagination'
import { ORDERBY, RESTAURANT_SORT } from '@/constants/sorting'

/** DTO */
import { CreateRestaurantDto } from './dto/request/create-restaurant.dto'

/** ANOTHER LIB */
import { memoryStorage } from 'multer'
import { fileUpload, handleFileFields } from '@/utils/file'
const storage = memoryStorage()

/** SWAGGER */
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  getSchemaPath,
  ApiExtraModels,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiConsumes,
  ApiCreatedResponse
} from '@nestjs/swagger'
import { BaseResponseDto } from './dto/base-response.dto'
import { FindRestaurantById } from './dto/response/find-restaurant-by-id.dto'
import { FIND_RESTAURANT_BY_ID } from './dto/request/param/param.dto'
import { FindAllRestaurantDto } from './dto/response/find-all-restaurant.dto'
import { FindAllRestaurantQueryDto } from './dto/request/query/find-all-restaurant.dto'
import { FindNearestRestaurantDto } from './dto/response/find-nearest-restaurant.dto'
import { FindNearestRestaurantQueryDto } from './dto/request/query/find-nearest-restaurant.dto'
import { RestaurantFileUploadDto } from './dto/request/file-upload.dto'
import { FileUploadResponseDto } from './dto/response/file-upload.dto'
@ApiTags('Restaurant')
@ApiBearerAuth()
@ApiExtraModels(
  BaseResponseDto,
  FindAllRestaurantDto,
  FindRestaurantById,
  FindAllRestaurantQueryDto,
  FindNearestRestaurantDto,
  FindNearestRestaurantQueryDto,
  RestaurantFileUploadDto,
  FileUploadResponseDto
)
@ApiBadRequestResponse({ description: getReasonPhrase(400), type: BaseResponseDto })
@ApiNotFoundResponse({ description: getReasonPhrase(404), type: BaseResponseDto })
@ApiInternalServerErrorResponse({ description: getReasonPhrase(500), type: BaseResponseDto })
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @ApiOkResponse({
    description: getReasonPhrase(200),
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(FindAllRestaurantDto) }
          }
        }
      ]
    }
  })
  async findAll(@Req() req, @Res() res, @Query() query: FindAllRestaurantQueryDto) {
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
        STATUS: STATUS.ACTIVE
      }
      const restaurants = await this.restaurantService.findAll(filter)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurants))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('/nearest')
  @ApiOkResponse({
    description: getReasonPhrase(200),
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(FindNearestRestaurantDto) }
          }
        }
      ]
    }
  })
  async findNearestAll(@Req() req, @Res() res, @Query() query: FindNearestRestaurantQueryDto) {
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
        LIMIT_DISTANCE: distance || NEAREST_DISTANCE //m.
      }
      const restaurants = await this.restaurantService.findNearestRestaurant(filter)
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurants))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Get('/:restaurantId')
  @ApiParam(FIND_RESTAURANT_BY_ID)
  @ApiOkResponse({
    description: getReasonPhrase(200),
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(FindRestaurantById) }
          }
        }
      ]
    }
  })
  async findById(@Req() req, @Res() res, @Param() param) {
    try {
      const { restaurantId } = param
      const filter = {
        restaurantId,
        status: STATUS.ACTIVE
      }
      const restaurant: FindRestaurantById | boolean = await this.restaurantService.findById(filter)
      if (!restaurant)
        return res.status(StatusCodes.NOT_FOUND).json(responseMessages(StatusCodes.NOT_FOUND, MSG.RESTAURANT.NOT_FOUND))
      return res.status(StatusCodes.OK).json(responseMessages(StatusCodes.OK, null, restaurant))
    } catch (error) {
      console.log(error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Post('/files')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RestaurantFileUploadDto })
  @ApiCreatedResponse({
    description: getReasonPhrase(200),
    type: FileUploadResponseDto
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'PROFILE', maxCount: 1 },
        { name: 'IMAGES', maxCount: 5 }
      ],
      { storage }
    )
  )
  async uploadFiles(@Req() req: any, @Res() res: Response) {
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
  async create(@Req() req, @Res() res, @Body(new ValidationPipe(CREATE)) payload: CreateRestaurantDto) {
    try {
      await beginTransaction()
      const created = await this.restaurantService.create(payload)
      await commit()
      return res.status(StatusCodes.CREATED).json(responseMessages(StatusCodes.CREATED))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }
}
