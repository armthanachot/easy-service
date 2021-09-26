import * as dotenv from "dotenv"
dotenv.config()

const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAP_TOKEN
const DISTANCE_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"

export {
    GOOGLE_MAP_API_KEY,
    DISTANCE_MATRIX_URL
}