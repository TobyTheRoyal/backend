import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async addToWatchlist(user: User, tmdbId: string): Promise<Watchlist> {
    const content = await this.contentRepository.findOne({ where: { tmdbId } });
    if (!content) throw new Error('Content not found');
    const watchlistEntry = this.watchlistRepository.create({ user, content });
    return this.watchlistRepository.save(watchlistEntry);
  }

  async getWatchlist(userId: number): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { user: { id: userId } },
      relations: ['content'],
    });
  }

  async getUserWatchlist(userId: number): Promise<Content[]> {
    const watchlistItems = await this.watchlistRepository.find({
      where: { user: { id: userId } },
      relations: ['content'],
    });
    return watchlistItems.map((item) => item.content);
  }

  async removeFromWatchlist(userId: number, tmdbId: string): Promise<void> {
    const content = await this.contentRepository.findOne({ where: { tmdbId } });
    if (!content) throw new Error('Content not found');
    await this.watchlistRepository.delete({ user: { id: userId }, content: { id: content.id } });
  }

  async findContentByTmdbId(tmdbId: string): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { tmdbId } });
  }
}