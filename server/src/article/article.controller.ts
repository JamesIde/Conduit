import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { Request, Response } from 'express';
import { JWTGuard } from 'src/user/auth.guard';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { LoggedUserGuard } from 'src/user/loggedUser.guard';
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JWTGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return await this.articleService.createArticle(req, createArticleDto);
  }

  @UseGuards(LoggedUserGuard)
  @Get()
  async getAllArticles(@Req() req: Request) {
    return await this.articleService.getArticles(req);
  }

  @UseGuards(JWTGuard)
  @Get('feed')
  async getUserFeed(@Req() req: Request) {
    return await this.articleService.getUserFeed(req);
  }

  @UseGuards(JWTGuard)
  @Get('user/favourites')
  async getFavourites(@Req() req: Request) {
    return await this.articleService.getFavourites(req);
  }

  @UseGuards(LoggedUserGuard)
  @Get(':slug')
  async getArticle(@Req() req, @Param('slug') slug: string) {
    return await this.articleService.getArticleBySlug(req, slug);
  }

  @UseGuards(JWTGuard)
  @Put(':slug')
  async updateArticle(
    @Req() req,
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.updateArticle(req, slug, updateArticleDto);
  }

  @UseGuards(JWTGuard)
  @Delete(':slug')
  async deleteArticle(@Req() req, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(req, slug);
  }

  @UseGuards(JWTGuard)
  @Post(':slug/favourite')
  async favouriteArticle(@Req() req, @Param('slug') slug: string) {
    return await this.articleService.favouriteArticle(req, slug);
  }
  @UseGuards(JWTGuard)
  @Delete(':slug/favourite')
  async unfavouriteArticle(@Req() req, @Param('slug') slug: string) {
    return await this.articleService.unfavouriteArticle(req, slug);
  }

  @Get('popular/tags')
  async getArticleTags() {
    return await this.articleService.getTags();
  }
}
