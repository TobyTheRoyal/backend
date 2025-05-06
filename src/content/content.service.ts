import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import axios from 'axios';

@Injectable()
export class ContentService {
  private readonly tmdbApiKey = process.env.TMDB_API_KEY || '1b3d7c196e53b4ebab10bf60054ef369';
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async getTrending(): Promise<Content[]> {
    const endpoint = 'trending/movie/week';
    return this.fetchAndSaveContent(endpoint);
  }

  async getTopRated(): Promise<Content[]> {
    const endpoint = 'movie/top_rated';
    return this.fetchAndSaveContent(endpoint);
  }

  async getNewReleases(): Promise<Content[]> {
    const endpoint = 'movie/now_playing';
    return this.fetchAndSaveContent(endpoint);
  }

  async searchTmdb(query: string, type: 'movie' | 'series'): Promise<any[]> {
    const endpoint = type === 'movie' ? 'search/movie' : 'search/tv';
    const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
      params: { api_key: this.tmdbApiKey, query },
    });
    return response.data.results;
  }

  async addFromTmdb(tmdbId: string, type: 'movie' | 'series'): Promise<Content> {
    const existingContent = await this.contentRepository.findOne({ where: { tmdbId } });
    if (existingContent) return existingContent;

    const endpoint = type === 'movie' ? `movie/${tmdbId}` : `tv/${tmdbId}`;
    const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
      params: { api_key: this.tmdbApiKey },
    });
    const data = response.data;
    const content = this.contentRepository.create({
      tmdbId,
      type,
      title: data.title || data.name,
      releaseYear: parseInt(data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0] || '0'),
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://placehold.co/200x300',
      imdbRating: data.vote_average || 0,
      rtRating: 0, // Optional: RT-Daten separat abrufen
    });
    return this.contentRepository.save(content);
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  async findById(id: number): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { id } });
  }

  async findByTmdbId(tmdbId: string): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { tmdbId } });
  }

  private async fetchAndSaveContent(endpoint: string): Promise<Content[]> {
    const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
      params: { api_key: this.tmdbApiKey },
    });
    const items = response.data.results || [];
    const contents: Content[] = [];
    for (const item of items) {
      const contentData = {
        tmdbId: item.id.toString(),
        type: item.media_type || 'movie',
        title: item.title || item.name,
        releaseYear: parseInt(item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '0'),
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/200x300',
        imdbRating: item.vote_average || 0,
        rtRating: 0,
      };
      const existingContent = await this.contentRepository.findOne({ where: { tmdbId: contentData.tmdbId } });
      if (!existingContent) {
        const content = this.contentRepository.create(contentData);
        contents.push(await this.contentRepository.save(content));
      } else {
        contents.push(existingContent);
      }
    }
    return contents;
  }
}