import { ContentService } from './content.service';
export declare class ContentController {
    private contentService;
    constructor(contentService: ContentService);
    addFromTmdb(body: {
        tmdbId: string;
        type: 'movie' | 'series';
    }): Promise<import("./entities/content.entity").Content>;
    searchTmdb(body: {
        query: string;
        type: 'movie' | 'series';
    }): Promise<any[]>;
    findAll(): Promise<import("./entities/content.entity").Content[]>;
}
