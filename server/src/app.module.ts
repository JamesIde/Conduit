import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credentials } from './identity/entities/Credentials';
import { User } from './identity/entities/User';
import { HelperModule } from './helper/helper.module';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/Article';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/Comments';
import { Favourites } from './favourites/entities/Favourites';
import { Follows } from './follows/entities/Follows';
import { IdentityModule } from './identity/identity.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadFileModule } from './upload-file/upload-file.module';
@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(
      // prod
      // {
      //   name: 'default',
      //   type: 'postgres',
      //   port: parseInt(process.env.POSTGRES_PORT),
      //   url: process.env.DATABASE_URI,
      //   synchronize: true,
      //   logging: true,
      //   entities: [User, Credentials, Article, Comment, Favourites, Follows],
      // },
      {
        // Local dev
        name: 'default',
        type: 'postgres',
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        entities: [User, Credentials, Article, Comment, Favourites, Follows],
      },
    ),

    IdentityModule,
    HelperModule,
    ArticleModule,
    CommentsModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 125,
    }),
    UploadFileModule,
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
