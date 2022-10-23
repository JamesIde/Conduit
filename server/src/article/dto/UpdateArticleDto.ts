import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateArticleDto } from './CreateArticleDto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  slug?: string;

  updatedAt?: Date;
}
