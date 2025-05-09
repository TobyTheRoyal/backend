import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ScheduleModule } from '@nestjs/schedule';    // falls Cron im selben Modul laufen soll
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), HttpModule, ScheduleModule.forRoot()],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService], // Exportiert ContentRepository
})
export class ContentModule {}