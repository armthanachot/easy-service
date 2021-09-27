import { ApiProperty } from '@nestjs/swagger'

class Info {
  @ApiProperty()
  text: string

  @ApiProperty()
  value: number
}

class DistanceInfo {
  @ApiProperty({
    type: Info
  })
  distance: Info

  @ApiProperty({
    type: Info
  })
  duration: Info

  @ApiProperty()
  status: string
}

class Restaurant {
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

  @ApiProperty({
    type: DistanceInfo
  })
  distanceInfo: DistanceInfo

  @ApiProperty()
  destination: string
}

export class FindNearestRestaurantDto {
  @ApiProperty()
  originalAddress: string

  @ApiProperty({
    type: [Restaurant]
  })
  nearestRestaurant: Restaurant[]
}
