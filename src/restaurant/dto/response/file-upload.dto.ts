import { ApiProperty } from '@nestjs/swagger'

class FileDto {
  @ApiProperty()
  refId: number

  @ApiProperty()
  type: string

  @ApiProperty()
  fileType: string

  @ApiProperty()
  fileName: string

  @ApiProperty()
  filePath: string

  @ApiProperty()
  fileExtension: string

  @ApiProperty()
  fileSize: number
}

export class FileUploadResponseDto {
  @ApiProperty()
  code: number

  @ApiProperty()
  message: string

  @ApiProperty({
    type: [FileDto]
  })
  data: FileDto[]
}
