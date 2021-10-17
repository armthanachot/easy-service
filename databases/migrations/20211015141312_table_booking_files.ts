import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('table_booking_files', (t) => {
    t.increments('fileId').unsigned().primary()
    t.string('bookingNumber').notNullable()
    t.integer('restaurantTableBookingId').notNullable().unsigned().references('restaurant_table_booking.restaurantTableBookingId').onDelete('CASCADE')
    t.string('fileField').notNullable()
    t.string('fileType').notNullable()
    t.string('fileName').notNullable()
    t.string('filePath').notNullable()
    t.string('fileExtension').notNullable()
    t.integer('fileSize').notNullable()
    t.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    t.string('createdBy')
    t.string('updatedBy')
  })
}

export async function down(knex: Knex): Promise<void> {}
