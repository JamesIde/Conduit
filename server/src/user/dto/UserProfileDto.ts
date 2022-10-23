import { Article } from 'src/article/dto/RetrieveArticleDto';
export interface UserProfile {
  id?: number;
  username: string;
  email?: string;
  name: string;
  image: string;
  isFollowed?: boolean;
  bio: string;
  articles: Article[];
}
