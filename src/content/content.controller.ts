import { Controller, Post, Body, Get, Query} from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';

@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('trending')
  async getTrending() {
    return this.contentService.getTrending();
  }

  @Get('top-rated')
  async getTopRated() {
    return this.contentService.getTopRated();
  }

  @Get('new-releases')
  async getNewReleases() {
    return this.contentService.getNewReleases();
  }

  @Post('add-tmdb')
  async addFromTmdb(@Body() body: { tmdbId: string; type: 'movie' | 'tv' }) {
    return this.contentService.addFromTmdb(body.tmdbId, body.type);
  }

  /*@Post('search')
  async searchTmdb(@Body() body: { query: string;}) {
    return this.contentService.searchTmdb(body.query);
  }*/

  @Post('search')
  async searchAll(@Body() body: { query: string }) {
  return this.contentService.searchAll(body.query);
}

  @Get('movies-page')
  async getMoviesPageWithRt(@Query('page') page = '1'): Promise<Content[]> {
    const p = parseInt(page, 10) || 1;
    return this.contentService.getMoviesPageWithRt(p);
  }

  @Get('series-page')
  async getSeriesPageWithRt(@Query('page') page = '1'): Promise<Content[]> {
    const p = parseInt(page, 10) || 1;
    return this.contentService.getSeriesPageWithRt(p);
  }

  @Get()
  async findAll() {
    return this.contentService.findAll();
  }
}