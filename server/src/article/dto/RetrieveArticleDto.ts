export interface ArticlesDto {
  metadata: Metadata;
  articleCount: number;
  articles: Article[];
}

export interface Author {
  id: number;
  username: string;
  email: string;
  name: string;
  image: string;
  bio: string;
}
export interface Metadata {
  take?: number;
  page?: number;
  skip?: number;
  tag?: any;
  isLogged?: boolean;
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
