export interface GetArticles {
  articles: Article[];
  articleCount: number;
  metadata: Metadata;
}

export interface Author {
  id: number;
  username: string;
  email: string;
  name?: string;
  image?: any;
  bio?: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags?: string[];
  createdAt: Date;
  favouriteCount: number;
  author: Author;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  body: string;
  createdAt: Date;
}

export interface ArticlesDto {
  metadata: Metadata;
  articleCount: number;
  articles: Article[];
}

export interface Metadata {
  take: any;
  skip: any;
  searchTerm?: any;
  isLogged?: boolean;
}

export interface PopularTags {
  tags: string[];
}

export interface NewArticle {
  title: string;
  description: string;
  body: string;
  tags: string[];
}

export interface Filters {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
  feed?: boolean;
}
