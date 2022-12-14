import { Article } from 'src/article/entities/Article';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credentials } from './Credentials';
import { Comment } from 'src/comments/entities/Comments';
import { Favourites } from 'src/favourites/entities/Favourites';
import { Follows } from 'src/follows/entities/Follows';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  bio: string;

  @Column({ default: null })
  image_url: string;

  @Column({ default: false })
  socialLogin: boolean;

  @Column({ default: null })
  isVerified: boolean;

  @Column({ default: null })
  providerId: string;

  @Column({ default: null })
  providerName: string;

  @OneToOne(() => Credentials, {
    cascade: true,
  })
  @JoinColumn()
  credentials: Credentials;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment;

  @OneToMany(() => Favourites, (favourite) => favourite.favUser)
  favArticle: Favourites;

  @OneToMany(() => Follows, (follow) => follow.followerUser)
  followers: Follows;
}
