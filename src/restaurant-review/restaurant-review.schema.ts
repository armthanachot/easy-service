import * as joi from "joi"

const FILES = {
    fileField: joi.string().required(),
    fileType: joi.string().required(),
    fileExtension: joi.string().required(),
    fileName: joi.string().required(),
    fileSize: joi.number().required(),
    filePath: joi.string().required()
}

const RESTAURANT_REVIEW_SCHEMA =  joi.object({
    restaurantCode:joi.string().required(),
    star:joi.number().max(5).required(),
    content:joi.string().allow('',null).required(),
    files:joi.array().items(FILES).required()
})

export {
    RESTAURANT_REVIEW_SCHEMA
}