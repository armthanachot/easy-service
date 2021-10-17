import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantReviewDto } from './create-restaurant-review.dto';

export class UpdateRestaurantReviewDto extends PartialType(CreateRestaurantReviewDto) {}
