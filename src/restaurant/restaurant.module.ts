import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { RestaurantService } from './restaurant.service'
import { RestaurantController } from './restaurant.controller'
import { RestaurantModel } from './restaurant.model'
import { permissionVerify } from 'middleware/auth.middleware'
import { rbac } from 'middleware/rbac.middleware'
import { ROLES } from '@/constants/user'
@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantModel]
})
export class RestaurantModule {
  async configure(consumer: MiddlewareConsumer) {
    const { GET, POST, PUT, DELETE, ALL } = RequestMethod
    const { GARAGE, GAS_STATION, HOSPITAL, NORMAL_USER, PUB_BAR, RESTAURANT } = ROLES
    consumer
      .apply(permissionVerify, await rbac(Object.values(ROLES)))
      .forRoutes({ path: '/restaurants', method: GET })
      .apply(permissionVerify, await rbac(Object.values(ROLES)))
      .forRoutes({ path: '/restaurants/nearest', method: GET })
      .apply(permissionVerify, await rbac(Object.values(ROLES)))
      .forRoutes({ path: '/restaurants/:restaurantId', method: GET })
      .apply(permissionVerify, await rbac([RESTAURANT]))
      .forRoutes({ path: '/restaurants/files', method: POST })
      .apply(permissionVerify,await rbac([RESTAURANT]))
      .forRoutes({ path: '/restaurants', method: POST })
      .apply(permissionVerify,await rbac([RESTAURANT]))
      .forRoutes({ path: '/restaurants/:restaurant_ref', method: PUT })
  }
}
