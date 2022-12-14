import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTGuard } from 'src/identity/auth.guard';
import { UploadFileService } from './upload-file.service';

@Controller('uploadfile')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post()
  @UseGuards(JWTGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
  ) {
    return this.uploadFileService.uploadFile(req, file);
  }
}
