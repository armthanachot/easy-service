import { BOOKING_METHOD } from "../../constants/restaurant";
import { STATUS } from "../../constants/status";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurant_table_booking", (t) => {
        t.increments("restaurantTableBookingId").unsigned().primary()
        t.string("bookingNumber").notNullable()
        t.string("customerName").notNullable()
        t.string("customerPhone").notNullable()
        t.string("restaurantCode").notNullable()
        t.string("tableSize").notNullable()
        t.integer("tableAmount").notNullable()
        t.dateTime("bookingDateTime").notNullable()
        t.enum("bookingMethod",Object.values(BOOKING_METHOD)).notNullable()
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE),
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

