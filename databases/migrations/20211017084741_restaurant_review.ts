import { STATUS } from "../../constants/status";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_review", (t) => {
        t.increments("restaurantReviewId").unsigned().primary()
        t.string("restaurantReviewNumber").notNullable()
        t.string("restaurantCode").notNullable()
        t.integer("star").notNullable().defaultTo(0)
        t.text("content")
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE),
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

