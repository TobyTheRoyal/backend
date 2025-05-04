import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
export declare class ContentService {
    private contentRepository;
    private readonly tmdbApiKey;
    private readonly tmdbBaseUrl;
    constructor(contentRepository: Repository<Content>);
    searchTmdb(query: string, type: 'movie' | 'series'): Promise<any[]>;
    addFromTmdb(tmdbId: string, type: 'movie' | 'series'): Promise<Content>;
    findAll(): Promise<Content[]>;
    findById(id: number): Promise<Content | null>;
}
