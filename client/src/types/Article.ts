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
  image_url: string;
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
  isFavourited?: boolean;
  favouriteCount: number;
  author?: Author;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  body: string;
  createdAt: Date;
  author: CommentAuthor;
}

export interface CommentAuthor extends Author {
  createdAt: Date;
}

export interface ArticlesDto {
  metadata: Metadata;
  articleCount: number;
  articles: Article[];
}

export interface Metadata {
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
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
  tag?: null | string;
  author?: null | string;
  favourited?: boolean;
  limit?: number;
  page?: number | string;
  feed?: boolean;
  isProfile?: boolean;
  userFeed?: boolean;
  globalFeed?: boolean;
  isFilterTag?: boolean;
}

export interface FavouriteStatus {
  slug: string;
  isFavourited: boolean;
}
