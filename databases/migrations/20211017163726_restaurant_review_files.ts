import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('restaurant_review_files', (t) => {
    t.increments('fileId').unsigned().primary()
    t.string('restaurantReviewNumber').notNullable()
    t.integer('restaurantReviewId').notNullable().unsigned().references('restaurant_review.restaurantReviewId').onDelete('CASCADE')
    t.string('fileField').notNullable()
    t.string('fileType').notNullable()
    t.string('fileName').notNullable()
    t.string('filePath').notNullable()
    t.string('fileExtension').notNullable()
    t.integer('fileSize').notNullable()
    t.timestamp('createdAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    t.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

export async function down(knex: Knex): Promise<void> {}
