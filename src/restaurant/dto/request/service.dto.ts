import { ApiProperty } from '@nestjs/swagger'

export class RestaurantServiceDto {
  restaurantCode: string

  @ApiProperty()
  serviceName: string
}
