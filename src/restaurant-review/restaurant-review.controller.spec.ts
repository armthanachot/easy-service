import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantReviewController } from './restaurant-review.controller';
import { RestaurantReviewService } from './restaurant-review.service';

describe('RestaurantReviewController', () => {
  let controller: RestaurantReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantReviewController],
      providers: [RestaurantReviewService],
    }).compile();

    controller = module.get<RestaurantReviewController>(RestaurantReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
