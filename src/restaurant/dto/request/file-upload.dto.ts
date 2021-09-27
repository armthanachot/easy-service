import { ApiProperty } from '@nestjs/swagger'

export class RestaurantFileUploadDto {
  @ApiProperty({
    type: 'object',
    required: false,
    items: { type: 'string', format: 'binary' }
  })
  readonly PROFILE: any

  @ApiProperty({
    type: 'array',
    required: false,
    items: { type: 'string', format: 'binary' }
  })
  readonly IMAGES: any[]
}
