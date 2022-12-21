import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/identity/entities/User';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
