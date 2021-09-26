import { ApiProperty } from '@nestjs/swagger'

export class RestaurantBestSellerDto {
  restaurantCode: string

  @ApiProperty()
  foodName: string

  @ApiProperty()
  price: number

  @ApiProperty()
  description: string
}
