import { BOOKING_METHOD, TABLE_SIZE } from "@/constants/restaurant"
import * as joi from "joi"

const FILES = {
    fileField: joi.string().required(),
    fileType: joi.string().required(),
    fileExtension: joi.string().required(),
    fileName: joi.string().required(),
    fileSize: joi.number().required(),
    filePath: joi.string().required()
}
const CREATE = joi.object({
    customerName:joi.string().required(),
    customerPhone:joi.string().required(),
    restaurantCode:joi.string().required(),
    tableSize:joi.string().valid(...Object.values(TABLE_SIZE)).required(),
    tableAmount:joi.number().required(),
    bookingDateTime:joi.date().required(),
    bookingMethod:joi.string().valid(...Object.values(BOOKING_METHOD)).required(),
    files:joi.array().items(FILES).min(1).required()
})

export {
    CREATE
}