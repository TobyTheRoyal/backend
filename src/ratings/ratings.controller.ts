import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { RatingService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async rateContent(@Request() req, @Body() body: { contentId: number; score: number }) {
    const user = req.user;
    return this.ratingService.rateContent(user, { id: body.contentId } as any, body.score);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserRatings(@Request() req) {
    return this.ratingService.getUserRatings(req.user.id);
  }
}