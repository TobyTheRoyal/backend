import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
export declare class WatchlistService {
    private watchlistRepository;
    constructor(watchlistRepository: Repository<Watchlist>);
    addToWatchlist(user: User, content: Content): Promise<Watchlist>;
    getWatchlist(userId: number): Promise<Watchlist[]>;
}
