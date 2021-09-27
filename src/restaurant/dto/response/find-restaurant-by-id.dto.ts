import { ApiProperty } from '@nestjs/swagger'

class RestaurantLabor {
  @ApiProperty()
  fullName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  position: string
}
class RestaurantService {
  @ApiProperty()
  serviceName: string
}
class RestaurantTable {
  @ApiProperty()
  tableSize: string

  @ApiProperty()
  tableAmount: string

  @ApiProperty()
  description: string
}
class RestaurantBestSeller {
  @ApiProperty()
  foodName: string

  @ApiProperty()
  price: string

  @ApiProperty()
  description: string
}
class RestaurantFile {
  @ApiProperty()
  filePath: string
}

export class FindRestaurantById {
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
  postcode: number

  @ApiProperty()
  latitude: number

  @ApiProperty()
  longitude: string

  @ApiProperty()
  branchNumber: string

  @ApiProperty()
  restaurantType: string

  @ApiProperty({
    type: [RestaurantLabor]
  })
  labors: RestaurantLabor[]

  @ApiProperty({
    type: [RestaurantService]
  })
  services: RestaurantService[]

  @ApiProperty({
    type: [RestaurantTable]
  })
  tables: RestaurantTable[]

  @ApiProperty({
    type: [RestaurantBestSeller]
  })
  bestSellers: RestaurantBestSeller[]

  @ApiProperty({
    type: [RestaurantFile]
  })
  files: RestaurantFile[]
}
