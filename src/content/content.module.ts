import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService], // Exportiere den Service für andere Module
})
export class ContentModule {}
