import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import axios from 'axios';

@Injectable()
export class ContentService {
  private readonly tmdbApiKey = 'dein-tmdb-api-key'; // Ersetze mit deinem API-Key
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async searchTmdb(query: string, type: 'movie' | 'series'): Promise<any[]> {
    const endpoint = type === 'movie' ? 'search/movie' : 'search/tv';
    const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
      params: {
        api_key: this.tmdbApiKey,
        query,
      },
    });
    return response.data.results;
  }

  async addFromTmdb(tmdbId: string, type: 'movie' | 'series'): Promise<Content> {
    const existingContent = await this.contentRepository.findOne({ where: { tmdbId } });
    if (existingContent) return existingContent;
    const content = this.contentRepository.create({ tmdbId, type });
    return this.contentRepository.save(content);
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  async findById(id: number): Promise<Content | null> { // Rückgabetyp angepasst
    return this.contentRepository.findOne({ where: { id } });
  }
}