import { findOne } from '@/utils/app';
import { Injectable } from '@nestjs/common';
import { ReserveTableModel } from './reserve-table.model';

@Injectable()
export class ReserveTableService {
    constructor(private readonly reserveTableModel: ReserveTableModel){}

    async findAll(payload){
        const result = await this.reserveTableModel.findAll(payload)
        return result
    }

    async findRestaurantByCode(filter){
        let restaurant = await this.reserveTableModel.findRestaurantByCode(filter)
        if(!restaurant.length) return false
        restaurant = await findOne(restaurant)
        const tables = await findOne(await this.reserveTableModel.findRestaurantTable(filter) )
        restaurant.tables = tables
        return restaurant
    }

    async findBookingByBookingId(filter){
        const result = await this.reserveTableModel.findTableBookingByBookingId(filter)
        if(!result.length) return false
        return await findOne(result)
    }

    async create(payload){
        const result = await this.reserveTableModel.create(payload)
        return result
    }

    async createReserveTableFile(payload){
        const result = await this.reserveTableModel.createReserveTableFile(payload)
        return result
    }

    async updateTableAmount(payload){
        const result = await this.reserveTableModel.updateRestaurantTable(payload)
        return result
    }

    async inactiveBooking(payload){
        const result = await this.reserveTableModel.inactiveBooking(payload)
        return result
    }
}
