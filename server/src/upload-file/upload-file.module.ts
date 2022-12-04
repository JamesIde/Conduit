import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UploadFileController],
  providers: [UploadFileService],
})
export class UploadFileModule {}
