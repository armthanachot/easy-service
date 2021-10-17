import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantReviewService } from './restaurant-review.service';

describe('RestaurantReviewService', () => {
  let service: RestaurantReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantReviewService],
    }).compile();

    service = module.get<RestaurantReviewService>(RestaurantReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
