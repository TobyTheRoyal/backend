import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/ratings.entity';
import { RatingService } from './ratings.service';
import { RatingController } from './ratings.controller';
import { UsersModule } from '../users/users.module';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), UsersModule, ContentModule],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}