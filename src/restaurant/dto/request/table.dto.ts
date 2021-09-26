import { POSITION } from '@/constants/restaurant'
import { ApiProperty } from '@nestjs/swagger'

export class RestaurantTableDto {
  restaurantCode: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  email: string

  @ApiProperty()
  phone: string

  @ApiProperty({
    enum: Object.values(POSITION)
  })
  position: string
}
