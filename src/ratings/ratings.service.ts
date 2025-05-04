import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/ratings.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async rateContent(user: User, content: Content, score: number): Promise<Rating> {
    if (score < 0 || score > 10) {
      throw new Error('Score must be between 0.0 and 10.0');
    }
    let rating = await this.ratingRepository.findOne({ where: { user: { id: user.id }, content: { id: content.id } } });
    if (rating) {
      rating.score = score;
      rating.ratedAt = new Date();
    } else {
      rating = this.ratingRepository.create({ user, content, score });
    }
    return this.ratingRepository.save(rating);
  }

  async getUserRatings(userId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { user: { id: userId } },
      relations: ['content'],
    });
  }
}