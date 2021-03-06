import { query } from '@/databases/db_connection'
export class RestaurantModel {
  async findAll({ STARTPAGE, PERPAGE, SORT_BY, SORT, SEARCH, STATUS }) {
    const SEARCH_CONDITION = SEARCH
      ? ` AND (restaurants.restaurantCode LIKE '%${SEARCH}%' OR restaurants.restaurantName LIKE '%${SEARCH}%')`
      : ``
    const result = await query(
      `SELECT restaurants.restaurantId,restaurants.restaurantCode,restaurants.restaurantName,restaurants.restaurantPhone,restaurants.restaurantLine,restaurants.restaurantEmail,restaurants.directorName,restaurants.fullAddress,restaurants.provinceId,restaurants.districtId,restaurants.subDistrictId,restaurants.postcode,restaurants.latitude,restaurants.longitude,restaurants.branchNumber,restaurants.restaurantType,restaurant_files.filePath AS profilePath FROM restaurants 
      LEFT JOIN restaurant_files ON restaurants.restaurantId = restaurant_files.restaurantId 
      WHERE restaurants.status = ? AND (restaurant_files.fileType = 'XL' OR restaurant_files.fileType IS NULL) ${SEARCH_CONDITION} GROUP BY restaurants.restaurantId ORDER BY ${SORT_BY} ${SORT} LIMIT ?, ?`,
      [STATUS, STARTPAGE, PERPAGE]
    )
    return result
  }

  async findAllWithoutLimit({ SEARCH, STATUS }) {
    const SEARCH_CONDITION = SEARCH
      ? ` AND (restaurantCode LIKE '%${SEARCH}%' OR restaurantName LIKE '%${SEARCH}%')`
      : ``
    const result = await query(
      `SELECT restaurantId,restaurantCode,restaurantName,restaurantPhone,restaurantLine,restaurantEmail,directorName,fullAddress,provinceId,districtId,subDistrictId,postcode,latitude,longitude,branchNumber,restaurantType FROM restaurants WHERE status = ? ${SEARCH_CONDITION}`,
      [STATUS]
    )
    return result
  }

  async findById({ restaurantId, status }) {
    const result = await query(
      `SELECT restaurantId,restaurantCode,restaurantName,restaurantPhone,restaurantLine,restaurantEmail,directorName,fullAddress,provinceId,districtId,subDistrictId,postcode,latitude,longitude,branchNumber,restaurantType FROM restaurants WHERE (restaurantId = ? OR restaurantCode = ?) AND status = ?`,
      [restaurantId, restaurantId, status]
    )
    return result
  }

  async findRestaurantLaborByRestaurantCode({ restaurantCode }) {
    const result = await query(
      `SELECT fullName, email, phone, position FROM restaurant_labor WHERE restaurantCode = ?`,
      [restaurantCode]
    )
    return result
  }

  async findRestaurantServiceByRestaurantCode({ restaurantCode }) {
    const result = await query(`SELECT serviceName FROM restaurant_services WHERE restaurantCode = ?`, [restaurantCode])
    return result
  }

  async findRestaurantTableByRestaurantCode({ restaurantCode }) {
    const result = await query(
      `SELECT tableSize, tableAmount, description FROM restaurant_tables WHERE restaurantCode = ?`,
      [restaurantCode]
    )
    return result
  }

  async findRestaurantBestSellerByRestaurantCode({ restaurantCode }) {
    const result = await query(
      `SELECT foodName, price, description FROM restaurant_best_seller WHERE restaurantCode = ?`,
      [restaurantCode]
    )
    return result
  }

  async findRestaurantFileByRestaurantCode({ restaurantCode }) {
    const result = await query(`SELECT filePath FROM restaurant_files WHERE restaurantCode = ?`, [restaurantCode])
    return result
  }

  async findTableBookingAmount({ restaurant_ref, tableSize, status }) {
    const result = await query(
      `SELECT SUM(tableAmount) AS tableAmount FROM restaurant_table_booking WHERE restaurantCode = ? AND tableSize = ? AND status = ?`, 
      [restaurant_ref, tableSize, status]
    )
    return result
  }

  async create(payload) {
    const result = await query(`INSERT INTO restaurants SET ?`, [payload])
    return result
  }

  async creatRestaurantLabor(payload) {
    const result = await query(`INSERT INTO restaurant_labor SET ?`, [payload])
    return result
  }

  async createRestaurantService(payload) {
    const result = await query(`INSERT INTO restaurant_services SET ?`, [payload])
    return result
  }

  async createRestaurantTable(payload) {
    const result = await query(`INSERT INTO restaurant_tables SET ?`, [payload])
    return result
  }

  async createRestaurantBestSeller(payload) {
    const result = await query(`INSERT INTO restaurant_best_seller SET ?`, [payload])
    return result
  }

  async createRestaurantFile(payload) {
    const result = await query(`INSERT INTO restaurant_files SET ?`, payload)
    return result
  }

  async update({ payload, restaurant_ref }) {
    const result = await query(`UPDATE restaurants SET ? WHERE (restaurantId = ? OR restaurantCode = ?)`, [
      payload,
      restaurant_ref,
      restaurant_ref
    ])
    return result
  }

  async deleteRestaurantLabor({ restaurant_ref }) {
    const result = await query(`DELETE FROM restaurant_labor WHERE restaurantCode = ?`, [restaurant_ref])
    return result
  }

  async deleteRestaurantService({ restaurant_ref }) {
    const result = await query(`DELETE FROM restaurant_services WHERE restaurantCode = ?`, [restaurant_ref])
    return result
  }

  async deleteRestaurantTable({ restaurant_ref }) {
    const result = await query(`DELETE FROM restaurant_tables WHERE restaurantCode = ?`, [restaurant_ref])
    return result
  }

  async deleteRestaurantBestSeller({ restaurant_ref }) {
    const result = await query(`DELETE FROM restaurant_best_seller WHERE restaurantCode = ?`, [restaurant_ref])
    return result
  }

  async deleteRestaurantFile({ restaurant_ref }) {
    const result = await query(`DELETE FROM restaurant_files WHERE restaurantCode = ?`, [restaurant_ref])
    return result
  }
}
