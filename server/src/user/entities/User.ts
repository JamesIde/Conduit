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

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  image: string;

  @Column({ default: null })
  bio: string;

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
