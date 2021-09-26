import { Knex } from "knex";
import { STATUS } from "../../constants/status";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_services", (t) => {
        t.increments("restaurantServiceId").unsigned().primary()
        t.string("restaurantCode").notNullable()
        t.string("serviceName").notNullable()
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE)
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

