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

export interface AddCommentRequest {
  body: string
}

export interface AddCommentProps { 
  
  articleId: number;
  slug: string;
  currentUser: any;
}