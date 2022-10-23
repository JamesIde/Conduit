import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/Article';
import { Comment } from './entities/Comments';
@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
