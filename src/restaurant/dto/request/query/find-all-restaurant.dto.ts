import { RESTAURANT_SORT, SORT } from '@/constants/sorting'
import { ApiProperty } from '@nestjs/swagger'

export class FindAllRestaurantQueryDto {
  @ApiProperty()
  page: number

  @ApiProperty()
  pageLimit: number

  @ApiProperty({
    enum: Object.values(SORT)
  })
  sort: string

  @ApiProperty({
    enum: Object.values(RESTAURANT_SORT)
  })
  sortBy: string

  @ApiProperty({
    required: false
  })
  search: string
}
