import { findOne, genCode, removeUselessKey } from '@/utils/app'
import { Injectable } from '@nestjs/common'
import { RestaurantModel } from './restaurant.model'
import { getMethod } from 'service/api'
import { LIMIT_DESTINATION } from '@/constants/google_map'
import { DISTANCE_MATRIX_URL, GOOGLE_MAP_API_KEY } from '@/constants/config'
import { MSG } from '@/constants/labels/errmsg'
import * as _ from 'lodash'
import { USELESS_KEYS } from '@/constants/restaurant'
import { CreateRestaurantDto } from './dto/request/create-restaurant.dto'
import { FindRestaurantById } from './dto/response/find-restaurant-by-id.dto'
@Injectable()
export class RestaurantService {
  constructor(readonly restaurantModel: RestaurantModel) {}
  async findAll(filter) {
    const restaurants = await this.restaurantModel.findAll(filter)
    return restaurants
  }

  async findById(filter) {
    const restaurant = await findOne(await this.restaurantModel.findById(filter))
    if (_.isEmpty(restaurant)) return false
    const { restaurantCode } = restaurant
    const labors = await this.restaurantModel.findRestaurantLaborByRestaurantCode({ restaurantCode })
    const services = await this.restaurantModel.findRestaurantServiceByRestaurantCode({ restaurantCode })
    const tables = await this.restaurantModel.findRestaurantTableByRestaurantCode({ restaurantCode })
    const bestSellers = await this.restaurantModel.findRestaurantBestSellerByRestaurantCode({ restaurantCode })
    const files = await this.restaurantModel.findRestaurantFileByRestaurantCode({ restaurantCode })
    Object.assign(restaurant, { labors, services, tables, bestSellers, files })
    return restaurant
  }

  async findNearestRestaurant(filter) {
    const { ORIGIN, TRAVEL_MODE, LANGUAGE, UNITS, LIMIT_DISTANCE } = filter
    const restaurants = await this.restaurantModel.findAllWithoutLimit(filter)
    const destination = []
    await restaurants.map((restaurant) => {
      destination.push(`${restaurant.latitude},${restaurant.longitude}`)
    })

    /** SEPERATE DESTINATION GROUP (Limitation of distancematrix endpoint 25 destination/time) */
    const destination_group = await destination
      .map((item, index) => {
        if (index % LIMIT_DESTINATION === 0) {
          return destination.slice(index, index + LIMIT_DESTINATION)
        }
      })
      .filter((item) => {
        return item
      })

    const nearest = { originAddress: null, nearestRestaurant: [] }
    await Promise.all(
      destination_group.map(async (group) => {
        /** CALL API */
        const {
          data: { rows, destination_addresses, origin_addresses }
        }: any = await getMethod(
          `${DISTANCE_MATRIX_URL}?units=${UNITS}&origins=${ORIGIN}&destinations=${group.join(
            '|'
          )}&mode=${TRAVEL_MODE}&language=${LANGUAGE}&key=${GOOGLE_MAP_API_KEY}`
        )
        nearest.originAddress = await findOne(origin_addresses)

        /** FIND RESTAURANT IN LIMIT DESTINATION */
        for (const row of rows) {
          const { elements } = row
          await elements.map((element, index) => {
            const { status } = element
            if (!Object.values(MSG.DISTANCE_MATRIX).includes(status)) {
              const {
                distance: { value: m_distance }
              } = element
              if (m_distance <= LIMIT_DISTANCE) {
                restaurants[index].distanceInfo = element
                restaurants[index].destination = destination_addresses[index]
                nearest.nearestRestaurant.push(restaurants[index])
              }
            }
          })
        }
      })
    )
    return nearest
  }

  async findTableBookingAmount(filter) {
    const result = await this.restaurantModel.findTableBookingAmount(filter)
    if (!result.length) return { tableAmount: 0 }
    return await findOne(result)
  }

  async create(payload: CreateRestaurantDto) {
    const restaurantCode = await genCode()
    payload.restaurantCode = restaurantCode
    const { labors, services, tables, bestSellers, files } = payload
    await removeUselessKey(payload, USELESS_KEYS.CREATE)

    const created = await this.restaurantModel.create(payload)
    const { insertId } = created
    if (labors.length) {
      for (const labor of labors) {
        labor.restaurantCode = restaurantCode
        const created = await this.restaurantModel.creatRestaurantLabor(labor)
      }
    }
    if (services.length) {
      for (const service of services) {
        service.restaurantCode = restaurantCode
        const created = await this.restaurantModel.createRestaurantService(service)
      }
    }
    if (tables.length) {
      for (const table of tables) {
        table.restaurantCode = restaurantCode
        const created = await this.restaurantModel.createRestaurantTable(table)
      }
    }
    if (bestSellers.length) {
      for (const bestSeller of bestSellers) {
        bestSeller.restaurantCode = restaurantCode
        const created = await this.restaurantModel.createRestaurantBestSeller(bestSeller)
      }
    }
    if (files.length) {
      for (const file of files) {
        file.restaurantId = insertId
        file.restaurantCode = restaurantCode
        const created = await this.restaurantModel.createRestaurantFile(file)
      }
    }
    return payload.restaurantCode
  }

  async creatRestaurantLabor(payload) {
    const created = await this.restaurantModel.creatRestaurantLabor(payload)
    return created
  }

  async createRestaurantService(payload) {
    const created = await this.restaurantModel.createRestaurantService(payload)
    return created
  }

  async createRestaurantTable(payload) {
    const created = await this.restaurantModel.createRestaurantTable(payload)
    return created
  }

  async createRestaurantBestSeller(payload) {
    const created = await this.restaurantModel.createRestaurantBestSeller(payload)
    return created
  }

  async createRestaurantFile(payload) {
    const created = await this.restaurantModel.createRestaurantFile(payload)
    return created
  }

  async update({ payload, restaurant_ref }) {
    const updated = await this.restaurantModel.update({ payload, restaurant_ref })
  }

  async deleteRestaurantLabor(ref) {
    const deleted = await this.restaurantModel.deleteRestaurantLabor(ref)
    return deleted
  }

  async deleteRestaurantService(ref) {
    const deleted = await this.restaurantModel.deleteRestaurantService(ref)
    return deleted
  }

  async deleteRestaurantTable(ref) {
    const deleted = await this.restaurantModel.deleteRestaurantTable(ref)
    return deleted
  }

  async deleteRestaurantBestSeller(ref) {
    const deleted = await this.restaurantModel.deleteRestaurantBestSeller(ref)
    return deleted
  }

  async deleteRestaurantFile(ref) {
    const deleted = await this.restaurantModel.deleteRestaurantFile(ref)
    return deleted
  }
}
