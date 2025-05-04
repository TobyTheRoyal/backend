import { Watchlist } from '../../watchlist/entities/watchlist.entity';
import { Rating } from '../../ratings/entities/ratings.entity';
export declare class Content {
    id: number;
    tmdbId: string;
    type: string;
    watchlist: Watchlist[];
    ratings: Rating[];
}
