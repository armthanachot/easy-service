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

    async findRestaurantByCode(restaurant_code){
        const restaurant = await this.reserveTableModel.findRestaurantByCode(restaurant_code)
        if(!restaurant.length) return false
        return await findOne(restaurant)
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
