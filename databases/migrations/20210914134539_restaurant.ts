import { Knex } from "knex";
import { STATUS } from "../../constants/status";
import { RESTAURANT_TYPE } from "../../constants/restaurant";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("restaurants", (t) => {
        t.increments("restaurantId").unsigned().primary()
        t.string("restaurantCode").notNullable()
        t.string("restaurantName").notNullable()
        t.string("restaurantPhone").notNullable()
        t.string("restaurantLine").notNullable()
        t.string("restaurantEmail").notNullable()
        t.string("directorName").notNullable()
        t.string("fullAddress").notNullable()
        t.string("provinceId").notNullable()
        t.string("districtId").notNullable()
        t.string("subDistrictId").notNullable()
        t.string("postcode").notNullable()
        t.double("latitude").notNullable()
        t.double("longitude").notNullable()
        t.string("branchNumber").notNullable()
        t.boolean("onlineOnly").notNullable()
        t.enum("restaurantType", Object.values(RESTAURANT_TYPE)).notNullable()
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE)
        t.string("updatedBy").defaultTo("system")
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.string("createdBy").notNullable().defaultTo("system")
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

