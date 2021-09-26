import { ROLES } from '@/constants/user'
import * as joi from 'joi'

const SIGNUP = joi.object({
  email: joi.string().required(),
  fullName: joi.string().required(),
  userName: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
  userRole: joi
    .string()
    .valid(...Object.values(ROLES))
    .required()
})

export { SIGNUP }
