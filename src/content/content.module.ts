import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService], // Exportiert ContentRepository
})
export class ContentModule {}