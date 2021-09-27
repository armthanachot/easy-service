import { RESTAURANT_TYPE } from '@/constants/restaurant'
import { ApiProperty } from '@nestjs/swagger'
import { RestaurantBestSellerDto } from './best-seller.dto'
import { CreateRestaurantFileDto } from './files.dto'
import { RestaurantLaborDto } from './labor.dto'
import { RestaurantServiceDto } from './service.dto'
import { RestaurantTableDto } from './table.dto'

export class CreateRestaurantDto {
  restaurantCode: string

  @ApiProperty()
  restaurantName: string

  @ApiProperty()
  restaurantPhone: string

  @ApiProperty()
  restaurantLine: string

  @ApiProperty()
  restaurantEmail: string

  @ApiProperty()
  directorName: string

  @ApiProperty()
  fullAddress: string

  @ApiProperty()
  provinceId: string

  @ApiProperty()
  districtId: string

  @ApiProperty()
  subDistrictId: string

  @ApiProperty()
  postcode: string

  @ApiProperty()
  latitude: number

  @ApiProperty()
  longitude: number

  @ApiProperty()
  branchNumber: string

  @ApiProperty({
    enum: Object.values(RESTAURANT_TYPE)
  })
  restaurantType: string

  @ApiProperty({
    type: [RestaurantLaborDto]
  })
  labors: RestaurantLaborDto[]

  @ApiProperty({
    type: [RestaurantServiceDto]
  })
  services: RestaurantServiceDto[]

  @ApiProperty({
    type: [RestaurantTableDto]
  })
  tables: RestaurantTableDto[]

  @ApiProperty({
    type: [RestaurantBestSellerDto]
  })
  bestSellers: RestaurantBestSellerDto[]

  @ApiProperty({
    type: [CreateRestaurantFileDto]
  })
  files: CreateRestaurantFileDto[]
}
