import { Comment } from 'src/comments/dto/CommentDto';
export interface UserProfile {
  id?: number;
  username: string;
  email?: string;
  name: string;
  image: string;
  isFollowed?: boolean;
  bio: string;
  articles: Article[];
  comments: Comment[];
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  createdAt: Date;
  favouriteCount: number;
  isFavourited?: boolean;
  author: Author;
}

export interface Author {
  id: number;
  username: string;
  email: string;
  name: string;
  image: string;
  bio: string;
}
