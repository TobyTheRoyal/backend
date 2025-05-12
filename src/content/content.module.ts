import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), HttpModule],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService], // Exportiert ContentRepository
})
export class ContentModule {}