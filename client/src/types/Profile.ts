export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  createdAt: Date;
  favouriteCount: number;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: Date;
}

export interface UserProfile {
  username: string;
  name: string;
  image: string;
  bio: string;
  articles: Article[];
  comments: Comment[];
}
