import { query } from '@/databases/db_connection'

export class RestaurantModel {
  async findAll({ STARTPAGE, PERPAGE, SORT_BY, SORT, SEARCH, STATUS }) {
    const SEARCH_CONDITION = SEARCH
      ? ` AND (restaurantCode LIKE '%${SEARCH}%' OR restaurantName LIKE '%${SEARCH}%')`
      : ``
    const result = await query(
      `SELECT restaurantId,restaurantCode,restaurantName,restaurantPhone,restaurantLine,restaurantEmail,directorName,fullAddress,provinceId,districtId,subDistrictId,postcode,latitude,longitude,branchNumber,restaurantType FROM restaurants WHERE status = ? ${SEARCH_CONDITION} GROUP BY restaurants.restaurantId ORDER BY ${SORT_BY} ${SORT} LIMIT ?, ?`,
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
      `SELECT restaurantId,restaurantCode,restaurantName,restaurantPhone,restaurantLine,restaurantEmail,directorName,fullAddress,provinceId,districtId,subDistrictId,postcode,latitude,longitude,branchNumber,restaurantType FROM restaurants WHERE restaurantId = ? AND status = ?`,
      [restaurantId, status]
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
}
