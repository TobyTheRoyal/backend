import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ContentService {
  private readonly tmdbApiKey = process.env.TMDB_API_KEY;
  private readonly omdbApiKey = process.env.OMDB_API_KEY;
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly omdbBaseUrl = 'http://www.omdbapi.com/';
  private cache: Content[] = [];

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private httpService: HttpService
  ) {}

  // Cron-Job zum täglichen Caching
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCron() {
    const all: Content[] = [];
    let page = 1;
    // Erster Request, um total_pages zu bekommen
    const firstResp = await firstValueFrom(
      this.httpService.get(
        `${this.tmdbBaseUrl}/discover/movie`,
        { params: { api_key: this.tmdbApiKey, page: '1' } }
      ).pipe(map(r => r.data))
    );
    const totalPages = Math.min(firstResp.total_pages, 500);
    all.push(...firstResp.results.map(item => this.mapToEntity(item)));
    // Weitere Seiten
    for (page = 2; page <= totalPages; page++) {
      const resp = await firstValueFrom(
        this.httpService.get(
          `${this.tmdbBaseUrl}/discover/movie`,
          { params: { api_key: this.tmdbApiKey, page: page.toString() } }
        ).pipe(map(r => r.data))
      );
      all.push(...resp.results.map(item => this.mapToEntity(item)));
    }
    this.cache = all;
  }

  getAllMoviesCached(): Content[] {
    return this.cache;
  }

  private mapToEntity(item: any): Content {
    const content = new Content();
    content.tmdbId = item.id.toString();
    content.title = item.title || item.name;
    content.releaseYear = parseInt((item.release_date || item.first_air_date || '').split('-')[0]) || 0;
    content.poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/200x300';
    content.imdbRating = parseFloat(item.vote_average) || null;
    content.rtRating = null;
    content.type = 'movie';
    return content;
  }

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
    try {
      const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
        params: { api_key: this.tmdbApiKey, query },
      });
      return response.data.results;
    } catch (error) {
      throw new NotFoundException(`Search failed for query: ${query}`);
    }
  }

  async addFromTmdb(tmdbId: string, type: 'movie' | 'series'): Promise<Content> {
    const existingContent = await this.contentRepository.findOne({ where: { tmdbId } });
    const endpoint = type === 'movie' ? `movie/${tmdbId}` : `tv/${tmdbId}`;
    try {
      const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
        params: { api_key: this.tmdbApiKey },
      });
      const data = response.data;
      const omdbData = await this.fetchOmdbData(data.imdb_id);
      const contentData = {
        tmdbId,
        type,
        title: data.title || data.name || 'Unknown Title',
        releaseYear: parseInt(
          data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0] || '0',
        ),
        poster: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : 'https://placehold.co/200x300',
        imdbRating: parseFloat(omdbData.imdbRating) || data.vote_average || 0,
        rtRating: omdbData.rtRating ? parseInt(omdbData.rtRating.replace('%', '')) : null,
      };
      const content = existingContent
        ? Object.assign(existingContent, contentData)
        : this.contentRepository.create(contentData);
      return await this.contentRepository.save(content);
    } catch (error) {
      throw new NotFoundException(`Content with TMDB ID ${tmdbId} not found`);
    }
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

  private async fetchOmdbData(imdbId: string): Promise<{ imdbRating: string; rtRating: string | null }> {
    if (!imdbId) {
      console.warn(`No IMDb ID provided for OMDb request`);
      return { imdbRating: '0', rtRating: null };
    }
    try {
      const response = await axios.get(this.omdbBaseUrl, {
        params: { i: imdbId, apikey: this.omdbApiKey },
      });
      const rtRating = response.data.Ratings?.find((r: { Source: string; Value: string }) => r.Source === 'Rotten Tomatoes')?.Value;
      console.log(`OMDb data for IMDb ID ${imdbId}:`, { imdbRating: response.data.imdbRating, rtRating });
      return {
        imdbRating: response.data.imdbRating || '0',
        rtRating: rtRating || null,
      };
    } catch (error) {
      console.error(`Failed to fetch OMDb data for IMDb ID ${imdbId}:`, error.message);
      return { imdbRating: '0', rtRating: null };
    }
  }

  private async fetchAndSaveContent(endpoint: string): Promise<Content[]> {
    try {
      const response = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, {
        params: { api_key: this.tmdbApiKey },
      });
      const items = response.data.results || [];
      const contents: Content[] = [];
      for (const item of items) {
        const tmdbId = item.id.toString();
        const existingContent = await this.contentRepository.findOne({
          where: { tmdbId },
        });
        const tmdbUrl = `${this.tmdbBaseUrl}/${item.media_type || 'movie'}/${tmdbId}`;
        const tmdbResponse = await axios.get(tmdbUrl, {
          params: { api_key: this.tmdbApiKey },
        });
        const tmdbData = tmdbResponse.data;
        const omdbData = await this.fetchOmdbData(tmdbData.imdb_id);
        const contentData = {
          tmdbId,
          type: item.media_type || 'movie',
          title: item.title || item.name || 'Unknown Title',
          releaseYear: parseInt(
            item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '0',
          ),
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://placehold.co/200x300',
          imdbRating: parseFloat(omdbData.imdbRating) || item.vote_average || 0,
          rtRating: omdbData.rtRating ? parseInt(omdbData.rtRating.replace('%', '')) : null,
        };
        const content = existingContent
          ? Object.assign(existingContent, contentData)
          : this.contentRepository.create(contentData);
        contents.push(await this.contentRepository.save(content));
      }
      return contents;
    } catch (error) {
      throw new NotFoundException(`Failed to fetch content from ${endpoint}`);
    }
  } 
}
