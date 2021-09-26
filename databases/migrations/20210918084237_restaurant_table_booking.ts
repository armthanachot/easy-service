import { BOOKING_METHOD } from "../../constants/restaurant";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_table_booking", (t) => {
        t.increments("restaurantTableBookingId").unsigned().primary()
        t.string("restaurantCode").notNullable()
        t.string("tableSize").notNullable()
        t.integer("tableAmount").notNullable()
        t.dateTime("bookingDateTime").notNullable()
        t.boolean("payedDeposit").defaultTo(false)
        t.string("evidenceFilePath")
        t.enum("bookingMethod",Object.values(BOOKING_METHOD)).notNullable()
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

