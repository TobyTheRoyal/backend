import { Controller, Post, Body, Get } from '@nestjs/common';
import { ContentService } from './content.service';

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
  async addFromTmdb(@Body() body: { tmdbId: string; type: 'movie' | 'series' }) {
    return this.contentService.addFromTmdb(body.tmdbId, body.type);
  }

  @Post('search')
  async searchTmdb(@Body() body: { query: string; type: 'movie' | 'series' }) {
    return this.contentService.searchTmdb(body.query, body.type);
  }

  @Get()
  async findAll() {
    return this.contentService.findAll();
  }
}