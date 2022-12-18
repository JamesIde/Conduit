import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { User } from './entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/jwt/jwt.module';
import { IdentityController } from './identity.controller';
import { Follows } from 'src/follows/entities/Follows';
import { Article } from 'src/article/entities/Article';
import { ConfigModule } from '@nestjs/config';
import { IdentityProviderService } from './identity.provider.service';
@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([User, Follows, Article]),
    ConfigModule,
  ],
  controllers: [IdentityController],
  providers: [IdentityService, IdentityProviderService],
  exports: [IdentityService, IdentityProviderService],
})
export class IdentityModule {}
