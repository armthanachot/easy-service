import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { RestaurantModule } from './restaurant/restaurant.module'
import { ReserveTableModule } from './reserve-table/reserve-table.module';
import { RestaurantReviewModule } from './restaurant-review/restaurant-review.module';

@Module({
  imports: [AuthModule, RestaurantModule, ReserveTableModule, RestaurantReviewModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
