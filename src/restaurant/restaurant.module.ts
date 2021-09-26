import { Module } from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { RestaurantController } from './restaurant.controller'
import { RestaurantModel } from './restaurant.model'

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantModel]
})
export class RestaurantModule {}
