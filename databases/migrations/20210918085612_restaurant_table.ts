import { Knex } from "knex";
import { TABLE_SIZE } from "../../constants/restaurant";
import { STATUS } from "../../constants/status";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_tables", (t) => {
        t.increments("restaurantTableId").unsigned().primary()
        t.string("restaurantCode").notNullable()
        t.enum("tableSize",Object.values(TABLE_SIZE)).notNullable()
        t.integer("tableAmount").notNullable().defaultTo(0)
        t.string("description")
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE)
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

