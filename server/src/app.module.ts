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
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TagsModule } from './tags/tags.module';
@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
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
    TagsModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
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
