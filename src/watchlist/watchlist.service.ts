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
  ) {}

  async addToWatchlist(user: User, content: Content): Promise<Watchlist> {
    const watchlistEntry = this.watchlistRepository.create({ user, content });
    return this.watchlistRepository.save(watchlistEntry);
  }

  async getWatchlist(userId: number): Promise<Watchlist[]> {
    return this.watchlistRepository.find({
      where: { user: { id: userId } },
      relations: ['content'],
    });
  }
}