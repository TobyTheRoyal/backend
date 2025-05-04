import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';
export declare class Watchlist {
    id: number;
    user: User;
    content: Content;
    addedAt: Date;
}
