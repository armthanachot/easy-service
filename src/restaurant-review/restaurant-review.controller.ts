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
import {  Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { RestaurantReviewService } from './restaurant-review.service'
import { CreateRestaurantReviewDto } from './dto/create-restaurant-review.dto'
import { UpdateRestaurantReviewDto } from './dto/update-restaurant-review.dto'

/** CONSTANTS */
import { MSG } from '@/constants/labels/errmsg'
import { STATUS } from '@/constants/status'
import { responseMessages } from '@/utils/response'
import { beginTransaction, commit, rollback } from '@/databases/db_connection'
import { ValidationPipe } from '@src/validation.pipe'
import { RESTAURANT_REVIEW_SCHEMA } from './restaurant-review.schema'

/** ANOTHER LIB */
import { memoryStorage } from 'multer'
import { fileUpload, handleFileFields } from '@/utils/file'
import { FILE_TOPIC } from '@/constants/restaurant-review'
import { genCode } from '@/utils/app'
const storage = memoryStorage()

@Controller('restaurant-review')
export class RestaurantReviewController {
  constructor(private readonly restaurantReviewService: RestaurantReviewService) {}

  @Get()
  findAll() {
    return this.restaurantReviewService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantReviewService.findOne(+id)
  }

  @Post('/files')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'RESTAURANT_REVIEW_IMAGES', maxCount: 5 }], { storage }))
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

  @Post()
  async create(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe(RESTAURANT_REVIEW_SCHEMA)) payload: CreateRestaurantReviewDto
  ) {
    try {
      await beginTransaction()
      const { files } = payload
      const restaurantReviewNumber =  genCode()
      payload.restaurantReviewNumber = restaurantReviewNumber
      delete payload.files
      const created = await this.restaurantReviewService.create(payload)
      if (files.length) {
        for (const file of files) {
          file.restaurantReviewId = created.insertId
          await this.restaurantReviewService.createRestaurantReviewFile(file)
        }
      }
      await commit()
      return res.status(StatusCodes.CREATED).json(responseMessages(StatusCodes.CREATED, null))
    } catch (error) {
      console.log(error)
      await rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessages(StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantReviewDto: UpdateRestaurantReviewDto) {
    return this.restaurantReviewService.update(+id, updateRestaurantReviewDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantReviewService.remove(+id)
  }
}
