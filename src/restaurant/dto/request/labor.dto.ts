import { TABLE_SIZE } from '@/constants/restaurant'
import { ApiProperty } from '@nestjs/swagger'

export class RestaurantLaborDto {
  restaurantCode: string

  @ApiProperty({
    enum: Object.values(TABLE_SIZE)
  })
  tableSize: string

  @ApiProperty()
  tableAmount: number

  @ApiProperty()
  description: string
}
