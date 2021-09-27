import { ApiProperty } from '@nestjs/swagger'

export class FindAllRestaurantDto {
  @ApiProperty()
  restaurantId: number

  @ApiProperty()
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

  @ApiProperty()
  restaurantType: string
}
