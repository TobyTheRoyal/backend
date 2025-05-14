import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import axios, { AxiosResponse } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { CastMember } from 'src/cast-member/cast-member.entity';

@Injectable()
export class ContentService implements OnModuleInit {
  private readonly tmdbApiKey = process.env.TMDB_API_KEY!;
  private readonly omdbApiKey = process.env.OMDB_API_KEY!;
  private readonly tmdbBaseUrl = 'https://api.themoviedb.org/3';
  private readonly omdbBaseUrl = 'https://www.omdbapi.com/';

  private cacheTrending: Content[] = [];
  private cacheTopRated: Content[] = [];
  private cacheNewReleases: Content[] = [];

  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    this.updateHomeCaches();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  handleCron() {
    this.updateHomeCaches();
  }

  private async updateHomeCaches() {
    const categories = [
      { key: 'trending', endpoint: 'trending/movie/week', cache: this.cacheTrending },
      { key: 'topRated', endpoint: 'movie/top_rated', cache: this.cacheTopRated },
      { key: 'newReleases', endpoint: 'movie/now_playing', cache: this.cacheNewReleases },
    ];

    for (const { endpoint, cache } of categories) {
      const data = await firstValueFrom(
        this.httpService
          .get(`${this.tmdbBaseUrl}/${endpoint}`, { params: { api_key: this.tmdbApiKey } })
          .pipe(
            map(r => r.data),
            timeout(5000),
            catchError(() => of({ results: [] })),
          ),
      );

      cache.length = 0;
      for (const item of data.results) {
        const content = this.mapToEntity(item, 'movie');
        const details = await firstValueFrom(
          this.httpService
            .get(`${this.tmdbBaseUrl}/movie/${item.id}`, { params: { api_key: this.tmdbApiKey } })
            .pipe(
              map(r => r.data),
              timeout(5000),
              catchError(() => of({ imdb_id: null })),
            ),
        );

        const omdb = details.imdb_id
          ? await this.fetchOmdbData(details.imdb_id)
          : { imdbRating: '0', rtRating: null };
        content.rtRating = omdb.rtRating ? parseInt(omdb.rtRating.replace('%', ''), 10) : null;
        cache.push(content);
      }
    }
  }

  getTrending(): Promise<Content[]>    { return Promise.resolve(this.cacheTrending); }
  getTopRated(): Promise<Content[]>    { return Promise.resolve(this.cacheTopRated); }
  getNewReleases(): Promise<Content[]> { return Promise.resolve(this.cacheNewReleases); }

  async getMoviesPageWithRt(page: number): Promise<Content[]> {
    const { results } = await firstValueFrom(
      this.httpService
        .get(`${this.tmdbBaseUrl}/discover/movie`, { params: { api_key: this.tmdbApiKey, page } })
        .pipe(
          map(r => r.data),
          catchError(() => of({ results: [] })),
        ),
    );

    return Promise.all(
      results.map(async item => {
        const content = this.mapToEntity(item, 'movie');
        const details = await firstValueFrom(
          this.httpService
            .get(`${this.tmdbBaseUrl}/movie/${item.id}`, { params: { api_key: this.tmdbApiKey } })
            .pipe(
              map(r => r.data),
              catchError(() => of({ imdb_id: null })),
            ),
        );

        const omdb = details.imdb_id
          ? await this.fetchOmdbData(details.imdb_id)
          : { imdbRating: '0', rtRating: null };
        content.rtRating = omdb.rtRating ? parseInt(omdb.rtRating.replace('%', ''), 10) : null;
        return content;
      }),
    );
  }

  async getSeriesPageWithRt(page: number): Promise<Content[]> {
    const { results } = await firstValueFrom(
      this.httpService
        .get(`${this.tmdbBaseUrl}/discover/tv`, { params: { api_key: this.tmdbApiKey, page } })
        .pipe(
          map(r => r.data),
          catchError(() => of({ results: [] })),
        ),
    );

    return Promise.all(
      results.map(async item => {
        const content = this.mapToEntity(item, 'tv');
        const details = await firstValueFrom(
          this.httpService
            .get(`${this.tmdbBaseUrl}/tv/${item.id}`, { params: { api_key: this.tmdbApiKey } })
            .pipe(
              map(r => r.data),
              catchError(() => of({ imdb_id: null })),
            ),
        );

        const omdb = details.imdb_id
          ? await this.fetchOmdbData(details.imdb_id)
          : { imdbRating: '0', rtRating: null };
        content.rtRating = omdb.rtRating ? parseInt(omdb.rtRating.replace('%', ''), 10) : null;
        return content;
      }),
    );
  }

  private mapToEntity(item: any, mediaType: 'movie'|'tv'): Content {
    const c = new Content();
    c.tmdbId = item.id.toString();
    c.type   = mediaType;
    c.title  = mediaType === 'movie' ? item.title : item.name;
    // Filme haben release_date, Serien first_air_date
    const dateStr = mediaType === 'movie'
      ? item.release_date
      : item.first_air_date;
    c.releaseYear = dateStr 
      ? parseInt(dateStr.slice(0,4), 10)
      : 0;
    c.poster     = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://placehold.co/200x300';
    c.imdbRating = parseFloat(item.vote_average) || null;
    c.rtRating   = null;
  
  return c;
  }

  private async fetchOmdbData(imdbId: string): Promise<{ imdbRating: string; rtRating: string | null }> {
    try {
      const { data } = await axios.get(this.omdbBaseUrl, { params: { i: imdbId, apikey: this.omdbApiKey } });
      const rt = data.Ratings?.find((r: any) => r.Source === 'Rotten Tomatoes')?.Value;
      return { imdbRating: data.imdbRating || '0', rtRating: rt || null };
    } catch {
      return { imdbRating: '0', rtRating: null };
    }
  }

  searchTmdb(query: string): Observable<Content[]> {
    if (!query.trim()) {
      return new Observable<Content[]>(obs => { obs.next([]); obs.complete(); });
    }
    return this.httpService.get<{ results: any[] }>(
      `${this.tmdbBaseUrl}/search/movie`,
      { params: { api_key: this.tmdbApiKey, query } }
    ).pipe(
      map(resp =>
        resp.data.results.map(item => ({
          id:           item.id,
          tmdbId:       item.id.toString(),
          title:        item.title,
          releaseYear:  +item.release_date.slice(0,4),
          poster:       item.poster_path
                        ? 'https://image.tmdb.org/t/p/w500'+item.poster_path
                        : 'https://placehold.co/200x300',
          type:         'movie',
          imdbRating:   item.vote_average,
          rtRating:     undefined,
          rating:       undefined,
          watchlist: [],
          ratings:[],
          genres: [],
          overview: item.overview,
          cast: [],
        } as Content))
      )
    );
  }

  async addFromTmdb(tmdbId: string, type: 'movie' | 'tv'): Promise<Content> {
    const endpoint = type === 'movie' ? `movie/${tmdbId}` : `tv/${tmdbId}`;
    const { data } = await axios.get(`${this.tmdbBaseUrl}/${endpoint}`, { params: { api_key: this.tmdbApiKey, append_to_response: type === 'movie' 
          ? 'credits' 
          : 'aggregate_credits'} });
    const omdb = await this.fetchOmdbData(data.imdb_id);
    const genresName: string[] = data.genres.map((g: any) => g.name);
    const rawCast = type === 'movie' ? data.credits.cast : data.aggregate_credits.cast;
    const castMembers: CastMember[] = (rawCast || []).slice(0, 10).map((c: any) => {
    const cm = new CastMember();
    cm.tmdbId        = c.id;
    cm.name          = c.name;
    cm.character     = type === 'movie'
      ? c.character
      : c.roles?.[0]?.character || '';
    cm.profilePathUrl= c.profile_path
      ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
      : 'https://placehold.co/80x120';
    return cm;
    });

    const rawDate = type === 'movie'
    ? data.release_date
    : data.first_air_date;
    const year = rawDate ? parseInt(rawDate.slice(0,4), 10) : 0;
    const entity = this.contentRepository.create({
      tmdbId,
      type,
      title: data.title || data.name,
      releaseYear: year,
      poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://placehold.co/200x300',
      imdbRating: parseFloat(omdb.imdbRating) || data.vote_average,
      rtRating: omdb.rtRating ? parseInt(omdb.rtRating.replace('%', ''), 10) : null,
      genres: genresName,
      overview: data.overview,
      cast: castMembers,
    });
    return this.contentRepository.save(entity);
  }

  findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  findById(id: number): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { id } });
  }

  findByTmdbId(tmdbId: string): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { tmdbId } });
  }

  async searchAll(query: string): Promise<Content[]> {
  const { data } = await axios.get(`${this.tmdbBaseUrl}/search/multi`, {
    params: { api_key: this.tmdbApiKey, query }
  });
  return data.results
    .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((item: any) => this.mapToEntity(item, item.media_type === 'tv' ? 'tv' : 'movie'));
}
}