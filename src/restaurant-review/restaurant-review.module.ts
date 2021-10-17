import { Module } from '@nestjs/common';
import { RestaurantReviewService } from './restaurant-review.service';
import { RestaurantReviewController } from './restaurant-review.controller';
import { RestaurantReviewModel } from './restaurant-review.model';

@Module({
  controllers: [RestaurantReviewController],
  providers: [RestaurantReviewService,RestaurantReviewModel]
})
export class RestaurantReviewModule {}
