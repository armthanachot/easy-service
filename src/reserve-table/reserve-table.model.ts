import { query } from '@/databases/db_connection'

export class ReserveTableModel {
  async findAll({ STARTPAGE, PERPAGE, SORT_BY, SORT, SEARCH, STATUS }) {
    const result = await query(
      `SELECT restaurant_table_booking.restaurantTableBookingId,restaurant_table_booking.bookingNumber,restaurant_table_booking.customerName,restaurant_table_booking.customerPhone,restaurant_table_booking.tableSize,restaurant_table_booking.tableAmount,restaurant_table_booking.bookingDateTime,restaurant_table_booking.bookingMethod,
    restaurants.restaurantName
    FROM restaurant_table_booking
    LEFT JOIN restaurants ON restaurant_table_booking.restaurantCode = restaurants.restaurantCode
    WHERE restaurant_table_booking.status = ?
    ORDER BY ${SORT_BY} ${SORT} LIMIT ?, ?
    `,
      [STATUS, STARTPAGE, PERPAGE]
    )

    return result
  }

  async findRestaurantByCode(restaurant_code) {
    const result = await query(`SELECT restaurantId, restaurantName FROM restaurants WHERE restaurantCode = ?`, [
      restaurant_code
    ])
    return result
  }

  async findTableBookingByBookingId({ booking_id, restaurant_code, status }) {
    const result = await query(
      `SELECT tableSize, tableAmount FROM restaurant_table_booking  WHERE restaurantTableBookingId = ? AND restaurantCode = ? AND status = ?`,
      [booking_id, restaurant_code, status]
    )
    return result
  }

  async create(payload) {
    const result = await query(`INSERT INTO restaurant_table_booking SET ?`, [payload])
    return result
  }

  async createReserveTableFile(payload) {
    const result = await query(`INSERT INTO table_booking_files SET ?`, [payload])
    return result
  }

  async updateRestaurantTable({ restaurantCode, amount, operator }) {
    const update_condition = operator === 'DECREASE' ? `tableAmount - ${amount}` : `tableAmount + ${amount}`
    const result = await query(
      `UPDATE restaurant_tables SET tableAmount = ${update_condition}  WHERE restaurantCode = ?`,
      [restaurantCode]
    )
    return result
  }

  async inactiveBooking({ booking_id, status }) {
    const result = await query(`UPDATE restaurant_table_booking SET status = ? WHERE restaurantTableBookingId = ?`, [
      status,
      booking_id
    ])
    return result
  }
}
