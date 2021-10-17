import { Injectable } from '@nestjs/common';
import { CreateRestaurantReviewDto } from './dto/create-restaurant-review.dto';
import { UpdateRestaurantReviewDto } from './dto/update-restaurant-review.dto';
import { RestaurantReviewModel } from './restaurant-review.model';

@Injectable()
export class RestaurantReviewService {
  constructor(private restaurantReviewModel:RestaurantReviewModel){}
  findAll() {
    return `This action returns all restaurantReview`;
  }
  
  findOne(id: number) {
    return `This action returns a #${id} restaurantReview`;
  }
  
  async create(payload: CreateRestaurantReviewDto) {
    const result = await this.restaurantReviewModel.create(payload)
    return result
  }

  async createRestaurantReviewFile(payload){
    const result = await this.restaurantReviewModel.createRestaurantReviewFile(payload)
    return result
  }

  update(id: number, updateRestaurantReviewDto: UpdateRestaurantReviewDto) {
    return `This action updates a #${id} restaurantReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantReview`;
  }
}
