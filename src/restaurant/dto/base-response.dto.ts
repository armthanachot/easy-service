import { ApiProperty, PartialType } from '@nestjs/swagger'

export class BaseResponseDto<T> {

    @ApiProperty()
    readonly code: number

    @ApiProperty()
    readonly message: string

}

