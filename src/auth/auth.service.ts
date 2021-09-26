import { findOne } from '@/utils/app'
import { Injectable } from '@nestjs/common'
import { AuthModel } from './auth.model'
@Injectable()
export class AuthService {
  constructor(readonly authModel: AuthModel) {}

  async signup(payload) {
    const created = await this.authModel.signup(payload)
    return created
  }

  async findUserByEmail(payload) {
    const user = await this.authModel.findUserByEmail(payload)
    return await findOne(user)
  }

  async updateToken(payload) {
    const updated = await this.authModel.updateToken(payload)
    return updated
  }
}
