import { RatingService } from './ratings.service';
export declare class RatingController {
    private ratingService;
    constructor(ratingService: RatingService);
    rateContent(req: any, body: {
        contentId: number;
        score: number;
    }): Promise<import("./entities/ratings.entity").Rating>;
    getUserRatings(req: any): Promise<import("./entities/ratings.entity").Rating[]>;
}
