import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credentials } from './user/entities/Credentials';
import { User } from './user/entities/User';
import { HelperModule } from './helper/helper.module';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/Article';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/Comments';
import { Favourites } from './favourites/entities/Favourites';
import { Follows } from './follows/entities/Follows';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'maximus',
      synchronize: true,
      // logging: true,
      entities: [User, Credentials, Article, Comment, Favourites, Follows],
    }),
    UserModule,
    HelperModule,
    ArticleModule,
    CommentsModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
