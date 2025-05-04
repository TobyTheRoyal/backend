import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { UsersModule } from '../users/users.module';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist]), UsersModule, ContentModule],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}