export interface Article {
  id: number;
}

export interface Comment {
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: number;
  article: Article;
  id: number;
}

export interface ArticleComment {
  id: number;
  slug: string;
  body: string;
}
