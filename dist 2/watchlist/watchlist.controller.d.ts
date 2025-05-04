import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private watchlistService;
    constructor(watchlistService: WatchlistService);
    addToWatchlist(req: any, body: {
        contentId: number;
    }): Promise<import("./entities/watchlist.entity").Watchlist>;
    getWatchlist(req: any): Promise<import("./entities/watchlist.entity").Watchlist[]>;
}
