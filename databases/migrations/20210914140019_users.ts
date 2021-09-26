import { Knex } from "knex";
import { STATUS } from "../../constants/status";
import { ROLES } from "../../constants/user";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (t) => {
        t.increments("userId").unsigned().primary()
        t.string("userCode").notNullable()
        t.string("email").notNullable()
        t.string("fullName").notNullable()
        t.string("userName").notNullable()
        t.string("password").notNullable()
        t.string("salt").notNullable()
        t.string("lastToken")
        t.enum("userRole", Object.values(ROLES)).notNullable()
        t.enum("status", Object.values(STATUS)).defaultTo(STATUS.ACTIVE)
        t.string("updatedBy").defaultTo("system")
        t.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
        t.string("createdBy").notNullable().defaultTo("system")
        t.timestamp("createdAt").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP"))
    })
}


export async function down(knex: Knex): Promise<void> {
}

