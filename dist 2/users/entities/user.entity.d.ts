import { Watchlist } from '../../watchlist/entities/watchlist.entity';
import { Rating } from '../../ratings/entities/ratings.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    watchlist: Watchlist[];
    ratings: Rating[];
}
