import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/Article';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { Comment } from './entities/Comments';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}

  /**
   * A public method to add a comment to an article
   */
  async addComment(
    @Req() req,
    id: number,
    slug: string,
    createCommentDto: CreateCommentDto,
  ) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
        id: id,
      },
    });

    if (!isValidArticle) {
      throw new HttpException(
        `Article '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const comment = this.commentRepo.create({
        body: req.body.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: req.user,
        article: {
          id: id,
        },
      });
      await this.commentRepo.save(comment);
      return comment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to delet a comment to an article
   */
  async deleteComment(
    @Req() req,
    articleId: number,
    commentId: number,
    slug: string,
  ) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        id: articleId,
        slug: slug,
      },
    });
    if (!isValidArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    try {
      const comment = await this.commentRepo.findOne({
        where: {
          author: req.user,
          id: commentId,
          article: {
            id: articleId,
          },
        },
      });
      await this.commentRepo.delete(comment.id);
      return {
        ok: true,
        message: 'Comment deleted!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
