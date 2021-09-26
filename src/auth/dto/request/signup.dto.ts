import { ROLES } from '@/constants/user'
import { ApiProperty } from '@nestjs/swagger'

export class UserSignupDto {
  public userCode: string

  @ApiProperty()
  readonly email: string

  @ApiProperty()
  readonly fullName: string

  @ApiProperty()
  readonly userName: string

  @ApiProperty()
  public password: string

  @ApiProperty()
  public confirmPassword: string

  public salt: string

  public lastToken: string

  @ApiProperty({
    enum: Object.values(ROLES)
  })
  readonly userRole: string
}
