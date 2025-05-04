import { Repository } from 'typeorm';
import { Rating } from './entities/ratings.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
export declare class RatingService {
    private ratingRepository;
    constructor(ratingRepository: Repository<Rating>);
    rateContent(user: User, content: Content, score: number): Promise<Rating>;
    getUserRatings(userId: number): Promise<Rating[]>;
}
