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
  name?: any;
  image_url: string;
  bio?: any;
  isFollowed: boolean;
  articles: Article[];
  comments: Comment[];
}
