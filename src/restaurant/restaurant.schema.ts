import * as joi from 'joi'
import { POSITION, SERVICE, RESTAURANT_TYPE, TABLE_SIZE } from '@/constants/restaurant'

const RESTAURANT_ADMIN = {
  fullName: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
  position: joi
    .string()
    .valid(...Object.values(POSITION))
    .required()
}

const RESTAURANT_SERVICE = {
  serviceName: joi
    .string()
    .valid(...Object.values(SERVICE))
    .required()
}

const RESTAURANT_TABLE = {
  tableSize: joi
    .string()
    .valid(...Object.values(TABLE_SIZE))
    .required(),
  tableAmount: joi.number().required(),
  description: joi.string().required()
}

const RESTAURANT_BEST_SELLER = {
  foodName: joi.string().required(),
  price: joi.number().required(),
  description: joi.string().allow(null, '').required()
}

const RESTAURANT_FILE = {
  fileField: joi.string().required(),
  fileType: joi.string().required(),
  fileExtension: joi.string().required(),
  fileName: joi.string().required(),
  fileSize: joi.number().required(),
  filePath: joi.string().required()
}

const CREATE = joi.object({
  restaurantName: joi.string().required(),
  restaurantPhone: joi.string().required(),
  restaurantLine: joi.string().required(),
  restaurantEmail: joi.string().required(),
  directorName: joi.string().required(),
  fullAddress: joi.string().required(),
  provinceId: joi.string().required(),
  districtId: joi.string().required(),
  subDistrictId: joi.string().required(),
  postcode: joi.string().required(),
  latitude: joi.number().required(),
  longitude: joi.number().required(),
  branchNumber: joi.string().required(),
  restaurantType: joi
    .string()
    .valid(...Object.values(RESTAURANT_TYPE))
    .required(),
  labors: joi.array().items(RESTAURANT_ADMIN).allow(null, '').required(),
  services: joi.array().items(RESTAURANT_SERVICE).allow(null, '').required(),
  tables: joi.array().items(RESTAURANT_TABLE).allow(null, '').required(),
  bestSellers: joi.array().items(RESTAURANT_BEST_SELLER).allow(null, '').required(),
  files: joi.array().items(RESTAURANT_FILE).allow(null, '').required()
})

export { CREATE }
