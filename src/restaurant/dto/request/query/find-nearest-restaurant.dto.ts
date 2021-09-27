import { DESTINATION_UNIT, LANGUAGE, TRAVEL_MODE } from '@/constants/google_map'
import { ApiProperty } from '@nestjs/swagger'

export class FindNearestRestaurantQueryDto {
  @ApiProperty({
    required: false
  })
  search: string

  @ApiProperty()
  origin: string

  @ApiProperty({
    enum: Object.values(TRAVEL_MODE)
  })
  travelMode: string

  @ApiProperty({
    enum: Object.values(LANGUAGE)
  })
  language: string

  @ApiProperty({
    enum: Object.values(DESTINATION_UNIT)
  })
  unit: string

  @ApiProperty()
  distance: number
}
