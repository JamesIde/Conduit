import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/identity/entities/User';
import { HelperService } from './helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
