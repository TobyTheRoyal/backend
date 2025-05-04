import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';
export declare class Rating {
    id: number;
    user: User;
    content: Content;
    score: number;
    ratedAt: Date;
}
