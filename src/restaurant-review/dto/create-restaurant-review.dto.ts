import { ApiProperty } from '@nestjs/swagger'

class Files {
  
  restaurantReviewNumber: string
  
  restaurantReviewId: number
  
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

export class CreateRestaurantReviewDto {
  
  restaurantReviewNumber: string
  
  @ApiProperty()
  restaurantCode: string

  @ApiProperty()
  star: number

  @ApiProperty()
  content: string

  @ApiProperty({
    type: [Files]
  })
  files: Files[]
}
