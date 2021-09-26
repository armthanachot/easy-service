import { POSITION } from "../../constants/restaurant";
import { Knex } from "knex";
import { STATUS } from "../../constants/status";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_labor", (t) => {
        t.increments("restaurantAdminId").unsigned().primary()
        t.string("restaurantCode").notNullable()
        t.string("fullName").notNullable()
        t.string("email").notNullable()
        t.string("phone").notNullable()
        t.enum("position", Object.values(POSITION)).notNullable()
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE)
        t.string("updatedBy").defaultTo("system")
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.string("createdBy").notNullable().defaultTo("system")
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

