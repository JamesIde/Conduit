import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './CreateCommentDto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
