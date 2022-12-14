import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/Article';
import { User } from 'src/identity/entities/User';
import { Favourites } from 'src/favourites/entities/Favourites';
import { Follows } from 'src/follows/entities/Follows';
import { Comment } from 'src/comments/entities/Comments';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Favourites, Follows, Comment]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
