import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JWTGuard } from 'src/identity/guards/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { UpdateCommentDto } from './dto/UpdateCommentDto';
import { Request } from 'express';
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /*
   * A public method to create a new comment on an article
   */
  @UseGuards(JWTGuard)
  @Post(':articleId/:articleSlug')
  async create(
    @Req() req: Request,
    @Param('articleId') id: number,
    @Param('articleSlug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.addComment(
      req,
      id,
      slug,
      createCommentDto,
    );
  }

  @Delete(':articleId/:articleSlug/:commentId')
  remove(
    @Req() req: Request,
    @Param('articleId') articleId: number,
    @Param('commentId') commentId: number,
    @Param('articleSlug') slug: string,
  ) {
    return this.commentsService.deleteComment(req, articleId, commentId, slug);
  }
}
