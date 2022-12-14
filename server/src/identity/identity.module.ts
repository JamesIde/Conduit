import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { User } from './entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/helper/helper.module';
import { IdentityController } from './identity.controller';
import { Follows } from 'src/follows/entities/Follows';
import { Article } from 'src/article/entities/Article';
@Module({
  imports: [HelperModule, TypeOrmModule.forFeature([User, Follows, Article])],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
