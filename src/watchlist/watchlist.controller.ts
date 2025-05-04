import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('watchlist')
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToWatchlist(@Request() req, @Body() body: { contentId: number }) {
    const user = req.user; // Vom JWT-Guard bereitgestellt
    return this.watchlistService.addToWatchlist(user, { id: body.contentId } as any);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWatchlist(@Request() req) {
    return this.watchlistService.getWatchlist(req.user.id);
  }
}