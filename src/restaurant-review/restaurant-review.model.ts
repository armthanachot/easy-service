import { query } from "@/databases/db_connection";

export class RestaurantReviewModel{
    async create(payload){
        const result = await query(`INSERT INTO restaurant_review SET ?`,[payload])
        return result
    }

    async createRestaurantReviewFile(payload){
        const result = await query(`INSERT INTO restaurant_review_files SET ?`,[payload])
        return result
    }
}