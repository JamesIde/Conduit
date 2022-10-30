import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { Article } from './entities/Article';
import { Request } from 'express';
import { ArticlesDto, Article as ArticleDto } from './dto/RetrieveArticleDto';
import { User } from 'src/user/entities/User';
import { Favourites } from 'src/favourites/entities/Favourites';
import { Follows } from 'src/follows/entities/Follows';
import { randomUUID } from 'crypto';
/**
           _____ _______ _____ _____ _      ______  _____ 
     /\   |  __ \__   __|_   _/ ____| |    |  ____|/ ____|
    /  \  | |__) | | |    | || |    | |    | |__  | (___  
   / /\ \ |  _  /  | |    | || |    | |    |  __|  \___ \ 
  / ____ \| | \ \  | |   _| || |____| |____| |____ ____) |
 /_/    \_\_|  \_\ |_|  |_____\_____|______|______|_____/ 
                                                                                                            
 */

/*
 * Set of methods for CRUD operations of articles
 * Most of these methods will require the decoded user ID in @Req() req: Request object
 */

@Injectable()
export class ArticleService {
  cachedTags: any;
  cachedTagTime: any;
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Favourites) private favRepo: Repository<Favourites>,
    @InjectRepository(Follows) private followRepo: Repository<Follows>,
  ) {}

  /**
  _____  _    _ ____  _      _____ _____   __  __ ______ _______ _    _  ____  _____   _____ 
 |  __ \| |  | |  _ \| |    |_   _/ ____| |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |__) | |  | | |_) | |      | || |      | \  / | |__     | |  | |__| | |  | | |  | | (___  
 |  ___/| |  | |  _ <| |      | || |      | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \ 
 | |    | |__| | |_) | |____ _| || |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |_|     \____/|____/|______|_____\_____| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/                                                                                                                                                                     
 */

  /**
   * A public method that creates an article.
   * It takes the request to access decoded user ID, this links user to article
   */
  async createArticle(@Req() req, createArticleDto: CreateArticleDto) {
    let slug = this.generateSlug(createArticleDto.title);
    const articleExists = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
    });

    if (articleExists) {
      throw new HttpException(
        `Article title '${createArticleDto.title}' already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let article = await this.articleRepo.create({
        ...createArticleDto,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: req.user,
      });
      return await this.articleRepo.save(article);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to retrieve all articles based on the following criteria
   * @param Take: The max number of records to return
   * @param Skip: The number of records to skip
   * @param searchTerm: The search term to filter by
   * @param user: The user id of a logged in user. May be undefined.
   * Protected by @see LoggedUserGuard
   */
  async getArticles(@Req() req: Request): Promise<ArticlesDto> {
    let { user, searchTerm, take, skip } = this.getQueryParams(req);

    if (!searchTerm) {
      return await this.getUnfilteredArticles(user, take, skip);
    }

    if (user) {
      const slugs = await this.getFavouriteArticleSlugs(user);
      console.log('user is present', user);
      console.log('slugs returned', slugs);
      console.warn('the search term is', searchTerm);
      const articles = await this.getArticleQueryBuilder(searchTerm);
      // If user favourite matches articles, add favourite property to article
      const filteredFavouritedArticlesWithUserAndSearchTerm = articles.map(
        (article) => {
          if (slugs.includes(article.slug)) {
            return {
              ...article,
              isFavourited: true,
            };
          }
          return {
            ...article,
            isFavourited: false,
          };
        },
      );
      return {
        metadata: {
          take: take,
          skip: skip,
          searchTerm: searchTerm,
          isLogged: true,
        },
        articleCount: filteredFavouritedArticlesWithUserAndSearchTerm.length,
        articles: filteredFavouritedArticlesWithUserAndSearchTerm,
      };
    }

    const articlesNoUserWithSearch = await this.getUnfilteredArticles(
      user,
      take,
      skip,
    );
    return {
      metadata: {
        take: take,
        skip: skip,
        searchTerm: searchTerm,
        isLogged: false,
      },
      articleCount: articlesNoUserWithSearch.articles.length,
      articles: articlesNoUserWithSearch.articles,
    };
  }

  /**
   * A public method for finding an article based on slug
   */
  async getArticleBySlug(@Req() req, slug: string): Promise<ArticleDto> {
    const article = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: {
        author: true,
        comments: {
          author: true,
        },
      },
    });

    if (!article) {
      throw new HttpException(
        `Article '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!req.user) {
      return article;
    }
    // See if the user has favourited this article
    const userFav = await this.favRepo.findOne({
      where: {
        favouritedArticle: {
          slug: slug,
        },
        favUser: {
          id: req.user,
        },
      },
    });

    if (userFav) {
      return {
        ...article,
        isFavourited: true,
      };
    }
    return {
      ...article,
      isFavourited: false,
    };
  }

  /**
   * A public method for updating an article based on slug
   */
  async updateArticle(
    @Req() req,
    slug: string,
    updateArticle: UpdateArticleDto,
  ) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
        author: req.user,
      },
    });

    if (!isValidArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    try {
      updateArticle.updatedAt = new Date();
      // Generate new slug based on title in param
      if (updateArticle.title) {
        const newSlug = this.generateSlug(updateArticle.title);
        updateArticle.slug = newSlug;
        await this.articleRepo.update({ slug: slug }, updateArticle);
      } else {
        // Ignore slug, update title, body, etc
        await this.articleRepo.update({ slug: slug }, updateArticle);
      }
      return {
        success: true,
        message: 'Successfully updated article',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   *  A public method to delete an article based on slug
   *  Finds the article based on slug and matches with the user ID associated with it
   *  Only the author can delete the article
   */
  async deleteArticle(@Req() req, slug: string) {
    // Check req.user matches userID linked to article
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
        author: req.user,
      },
    });

    if (!isValidArticle) {
      throw new HttpException(
        `Article '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.articleRepo.delete({ slug: slug });
      return {
        ok: true,
        message: 'Article successfully deleted',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A public method to favourite an article base on slug, for a user.
   */
  async favouriteArticle(@Req() req, slug: string) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['author'],
    });

    if (!isValidArticle)
      throw new HttpException('Article not found', HttpStatus.BAD_REQUEST);

    if (isValidArticle.author.id === req.user) {
      throw new HttpException(
        'You cannot favourite your own article!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if article is already favourited by user
    const isValidFavourite = await this.favRepo.findOne({
      where: {
        favUser: {
          id: req.user,
        },
        favouritedArticle: {
          id: isValidArticle.id,
        },
      },
    });

    if (isValidFavourite) {
      throw new HttpException(
        'Article already favourited',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const favourite = this.favRepo.create({
        dateFavourited: new Date(),
        favUser: {
          id: req.user,
        },
        favouritedArticle: {
          id: isValidArticle.id,
        },
      });
      // Increment article favourite count
      isValidArticle.favouriteCount += 1;
      await this.articleRepo.save(isValidArticle);
      await this.favRepo.save(favourite);
      return {
        ok: true,
        message: 'Article favourited!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to unfavourite an article base on slug, for a user.
   */
  async unfavouriteArticle(@Req() req, slug: string) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['author'],
    });

    if (!isValidArticle)
      throw new HttpException('Article not found', HttpStatus.BAD_REQUEST);

    if (isValidArticle.author.id === req.user) {
      throw new HttpException(
        'You cannot unfavourite your own article!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const unfavouriteArticle = await this.favRepo.findOne({
      where: {
        favUser: req.user,
        favouritedArticle: {
          id: isValidArticle.id,
        },
      },
      relations: ['favouritedArticle'],
    });

    if (!unfavouriteArticle) {
      throw new HttpException(
        'Article already unfavourited!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.favRepo.delete(unfavouriteArticle.id);
      (isValidArticle.favouriteCount as any) -= 1;
      await this.articleRepo.save(isValidArticle);
      return {
        ok: true,
        message: 'Article unfavourited!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to get a users favourited articles
   */
  async getFavourites(@Req() req) {
    const favourites = await this.favRepo.find({
      where: {
        favUser: {
          id: req.user,
        },
      },
      relations: {
        favouritedArticle: {
          author: true,
        },
      },
    });

    if (!favourites) {
      throw new HttpException(
        'No articles favourited yet. Get reading!',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      favourites: favourites,
    };
  }

  /**
   * A publically available method to get the articles of the logged in users followers
   */
  async getUserFeed(@Req() req): Promise<ArticlesDto> {
    let take = req.query.hasOwnProperty('take') ? req.query.take : 10;
    let skip = req.query.hasOwnProperty('skip') ? req.query.skip : 0;
    let order = req.query.hasOwnProperty('order') ? req.query.order : 'DESC';

    const following = await this.followRepo.find({
      where: { userFollowingThePerson: req.user },
    });

    if (!following) {
      throw new HttpException(
        "You aren't following anyone!",
        HttpStatus.BAD_REQUEST,
      );
    }
    // const articles = console.log(
    //   'printing out users being followed by logged user',
    //   following.map((follow) => follow.userBeingFollowed),
    // );

    const userFeed = await this.articleRepo.find({
      where: {
        author: {
          // Now this is wizardry...
          username: In(following.map((follow) => follow.userBeingFollowed)),
        },
      },
      relations: {
        author: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: take as number,
      skip: skip as number,
    });

    return {
      metadata: {
        take: take,
        skip: skip,
        isLogged: req.user ? true : false,
      },
      articleCount: userFeed.length,
      articles: userFeed,
    };
  }

  /**
   * A public method to return the tags of the most recent 5 articles, without duplicates.
   * It uses in memory storage to cache the results every 30 minutes for improved performance.
   */
  async getTags() {
    if (
      this.cachedTagTime &&
      this.cachedTagTime > Date.now() - 30 * 60 * 1000
    ) {
      return {
        cached: true,
        cachedTagTime: new Date(this.cachedTagTime).toLocaleString('en-AU'),
        tags: this.cachedTags,
      };
    } else {
      const articleTags = await this.articleRepo.find({
        select: {
          tags: true,
        },
        order: {
          createdAt: 'DESC',
        },
        take: 5,
      });
      const tags = this.generatePopularTags(articleTags);
      this.cachedTags = tags;
      this.cachedTagTime = Date.now();
      return {
        cached: false,
        cachedTime: new Date(this.cachedTagTime).toLocaleString('en-AU'),
        tags: this.cachedTags,
      };
    }
  }

  /*
  _____  _____  _______      __  _______ ______   __  __ ______ _______ _    _  ____  _____   _____ 
 |  __ \|  __ \|_   _\ \    / /\|__   __|  ____| |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |__) | |__) | | |  \ \  / /  \  | |  | |__    | \  / | |__     | |  | |__| | |  | | |  | | (___  
 |  ___/|  _  /  | |   \ \/ / /\ \ | |  |  __|   | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \ 
 | |    | | \ \ _| |_   \  / ____ \| |  | |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |_|    |_|  \_\_____|   \/_/    \_\_|  |______| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/                                                                                                                                                                                                
*/

  /**
   * A private method for converting the first 5 articles tags into an array of tags, with no duplicates.
   * The first 10 tags are returned
   */
  private generatePopularTags(tags: Article[]) {
    let tagList = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags[i].tags.length; j++) {
        tagList.push(tags[i].tags[j]);
      }
    }

    let filteredTags = [...new Set(tagList)];
    return filteredTags.slice(0, 10);
  }

  /**
   * A private method for converting title into slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * A private method to desctructure query params from request
   */
  private getQueryParams(@Req() req) {
    let take = req.query.hasOwnProperty('take') ? req.query.take : 10;
    let skip = req.query.hasOwnProperty('skip') ? req.query.skip : 0;
    let searchTerm = req.query.searchTerm;
    let user: any = req.user;
    return { user, searchTerm, take, skip };
  }

  /**
   * A private method for querying the database for all articles
   * No searching or user params are applied here
   */
  private async getInternalUnfilteredArticles(take: any, skip: any) {
    return await this.articleRepo.find({
      relations: {
        author: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: take as number,
      skip: skip as number,
    });
  }

  /**
   * A private method to return all articles, with take and skip but no search term.
   * It also applies the user param to search for articles a user has favourited, if logged in.
   */
  private async getUnfilteredArticles(
    user: boolean | undefined,
    take: number,
    skip: number,
  ): Promise<ArticlesDto> {
    if (user) {
      const favArticleSlugs = await this.getFavouriteArticleSlugs(user);
      const articles = await this.getInternalUnfilteredArticles(take, skip);

      // If user favourite matches articles, add favourite property to article
      const filteredFavouritedArticles = articles.map((article) => {
        if (favArticleSlugs.includes(article.slug)) {
          return {
            ...article,
            isFavourited: true,
          };
        }
        return {
          ...article,
          isFavourited: false,
        };
      });
      return {
        metadata: {
          take: take,
          skip: skip,
          isLogged: true,
        },
        articleCount: filteredFavouritedArticles.length,
        articles: filteredFavouritedArticles,
      };
    }
    // Return unfiltered articles with no user filtering
    const articles = await this.getInternalUnfilteredArticles(take, skip);
    return {
      metadata: {
        take: take,
        skip: skip,
        isLogged: false,
      },
      articleCount: articles.length,
      articles: articles,
    };
  }

  /**
   * A private method that returns all favourited article slugs with the logged in user
   */
  private async getFavouriteArticleSlugs(user) {
    const userFavourites = await this.favRepo.find({
      where: {
        favUser: {
          id: user,
        },
      },
      relations: {
        favouritedArticle: true,
      },
    });

    const favArticleSlugs = [];

    userFavourites.forEach((fav) => {
      favArticleSlugs.push(fav.favouritedArticle.slug);
    });
    return favArticleSlugs;
  }

  /**
   * A private method to get all articles using the query builder for text searching based on searchTerm param
   */
  // TODO Fix why this isn't searching properly
  private async getArticleQueryBuilder(searchTerm: string) {
    console.log('search term received: ', searchTerm);
    const querybuilderArticles = await this.articleRepo
      .createQueryBuilder()
      .select()
      .where('to_tsvector(title) @@ plainto_tsquery (:searchTerm)', {
        searchTerm: `${searchTerm}:*`,
      })
      .where('to_tsvector(description) @@ plainto_tsquery (:searchTerm)', {
        searchTerm: `${searchTerm}:*`,
      })
      // orWhere tsVector tags array
      .where('array_to_tsvector(tags) @@ plainto_tsquery (:searchTerm)', {
        searchTerm: `${searchTerm}`,
      })
      .orderBy(
        'ts_rank(to_tsvector(title), plainto_tsquery (:searchTerm))',
        'DESC',
      )
      .getMany();
    console.log('query builder arts', querybuilderArticles.length);
    return querybuilderArticles;
  }
}
