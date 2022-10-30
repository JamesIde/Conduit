import { Article } from 'src/article/dto/RetrieveArticleDto';
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
