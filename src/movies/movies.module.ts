import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../content/entities/content.entity';
import { ContentService } from '../content/content.service';
import { MoviesController } from './movies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
  ],
  providers: [ContentService],
  controllers: [MoviesController],
})
export class MoviesModule {}