import { ApiProperty } from '@nestjs/swagger'

export class CreateRestaurantFileDto {
  restaurantId: number

  restaurantCode: string

  @ApiProperty()
  fileField: string

  @ApiProperty()
  fileType: string

  @ApiProperty()
  fileExtension: string

  @ApiProperty()
  fileName: string

  @ApiProperty()
  fileSize: number

  @ApiProperty()
  filePath: string
}
