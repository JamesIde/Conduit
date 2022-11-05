import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/helper/helper.module';
import { UserController } from './user.controller';
import { Follows } from 'src/follows/entities/Follows';
import { Article } from 'src/article/entities/Article';
@Module({
  imports: [HelperModule, TypeOrmModule.forFeature([User, Follows, Article])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
