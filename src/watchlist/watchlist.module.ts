import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { ContentModule } from '../content/content.module'; // Import ContentModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Watchlist]),
    ContentModule, // Import für ContentRepository
  ],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}