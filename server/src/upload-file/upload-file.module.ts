import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/identity/entities/User';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UploadFileController],
  providers: [UploadFileService],
})
export class UploadFileModule {}
