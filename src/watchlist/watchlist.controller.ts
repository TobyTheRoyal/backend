import { Controller, Post, Body, Get, Delete, UseGuards, Request, Param } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToWatchlist(@Request() req, @Body() body: { tmdbId: string }) {
    const user = req.user;
    return this.watchlistService.addToWatchlist(user, body.tmdbId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWatchlist(@Request() req) {
    return this.watchlistService.getWatchlist(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserWatchlist(@Request() req) {
    return this.watchlistService.getUserWatchlist(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:tmdbId')
  async removeFromWatchlist(@Request() req, @Param('tmdbId') tmdbId: string) {
    await this.watchlistService.removeFromWatchlist(req.user.id, tmdbId);
    return { message: 'Content removed from watchlist' };
  }
}