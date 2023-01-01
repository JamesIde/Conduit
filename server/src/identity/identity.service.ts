import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { User } from './entities/User';
import { JwtService } from 'src/jwt/jwt.service';
import { Param, Req, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { LoginUserDto } from './dto/LoginUserDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { UserProfile } from './dto/UserProfileDto';
import { Article } from 'src/article/entities/Article';
import * as bcrypt from 'bcryptjs';
import { Follows } from 'src/follows/entities/Follows';
import { UpdateProfileSuccess } from './dto/UpdateProfileSuccessDto';
import { AccessTokenSuccess } from 'src/jwt/models/Token';
import { ProfileTransformation } from './transformation/ProfileTransformation';
import { UserData } from './models/Identity';
import { Comment } from '../comments/dto/CommentDto';
/*
  _    _  _____ ______ _____            _    _ _______ _    _ ______ _   _ _______ _____ _____       _______ _____ ____  _   _ 
 | |  | |/ ____|  ____|  __ \      /\  | |  | |__   __| |  | |  ____| \ | |__   __|_   _/ ____|   /\|__   __|_   _/ __ \| \ | |
 | |  | | (___ | |__  | |__) |    /  \ | |  | |  | |  | |__| | |__  |  \| |  | |    | || |       /  \  | |    | || |  | |  \| |
 | |  | |\___ \|  __| |  _  /    / /\ \| |  | |  | |  |  __  |  __| | . ` |  | |    | || |      / /\ \ | |    | || |  | | . ` |
 | |__| |____) | |____| | \ \   / ____ \ |__| |  | |  | |  | | |____| |\  |  | |   _| || |____ / ____ \| |   _| || |__| | |\  |
  \____/|_____/|______|_|  \_\ /_/    \_\____/   |_|  |_|  |_|______|_| \_|  |_|  |_____\_____/_/    \_\_|  |_____\____/|_| \_|
                                                                                                                               
                                                                                                                                                                                                                                                                                                                         
*/

/**
 * Set of public methods for user registration and login.
 */

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Follows) private followRepo: Repository<Follows>,
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private jwtService: JwtService,
  ) {}

  /**
   * A public method to call to register a user
   * @returns Promise<LoggedUserDto>
   */
  async registerUser(
    @Res({ passthrough: true }) res: Response,
    registerUser: RegisterUserDto,
  ): Promise<UserData> {
    const { username, email, password, confirmPassword } = registerUser;

    let isValidEmail = await this.userRepo.findOne({
      where: [{ email: email }],
    });
    if (isValidEmail) {
      throw new HttpException(
        'An account already exists with this email, try signing in instead. ',
        HttpStatus.BAD_REQUEST,
      );
    }

    let isValidUserName = await this.userRepo.findOne({
      where: [{ username: username }],
    });
    if (isValidUserName) {
      throw new HttpException(
        'This username is already taken. Please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    let hashPwd = await bcrypt.hash(password, 10);
    try {
      let user = this.userRepo.create({
        username: username.trim(),
        name: username,
        email: email,
        isVerified: true,
        image_url: 'https://static.productionready.io/images/smiley-cyrus.jpg',
        providerName: 'local',
        credentials: {
          createdAt: new Date(),
          password: hashPwd,
        },
      });

      let createdUser = await this.userRepo.save(user);
      if (createdUser) {
        const token = await this.jwtService.generateAccessToken(createdUser);
        if (token.ok) {
          await this.jwtService.sendRefreshCookie(res, createdUser);
          return ProfileTransformation.transformUserProfile(createdUser, token);
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to login a user with email and password
   * Returns the user object, with access token and sends a cookie.
   */
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    loginUser: LoginUserDto,
  ): Promise<UserData> {
    const user = await this.userRepo.findOne({
      where: {
        email: loginUser.email,
      },
      relations: {
        credentials: true,
      },
    });

    if (!user) {
      throw new HttpException(
        `No account found with email ${loginUser.email}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginUser.password,
      user.credentials.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'Incorrect password, please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Send cookie
    const token = await this.jwtService.generateAccessToken(user);
    if (token.ok) {
      await this.jwtService.sendRefreshCookie(res, user);
      return ProfileTransformation.transformUserProfile(user, token);
    }
  }

  /**
   * A public method to update the user profile
   * Fields like name, image and bio may be updated
   */
  async updateProfile(
    @Req() req,
    updateProfile: UpdateProfileDto,
  ): Promise<UpdateProfileSuccess> {
    try {
      const user = await this.userRepo.update(req.user.id, updateProfile);
      if (user) {
        const updatedUser = await this.userRepo.findOne({
          where: {
            id: req.user.id,
          },
        });
        return updatedUser as UpdateProfileSuccess;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A publicly available method to get a user profile based on slug
   * This differs from @see getProfile
   * Used by general users to click on user profiles and see their articles
   */
  async getUserProfile(@Req() req, username: string): Promise<UserProfile> {
    if (!username)
      throw new HttpException(
        'Username must be provided',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const queryUser = await this.userRepo.findOne({
        where: {
          username: username,
        },
        select: {
          email: false,
        },
        relations: ['comments', 'articles'],
      });

      const queryArticle = await this.articleRepo.find({
        where: {
          author: {
            username: queryUser.username,
          },
        },
        relations: ['author', 'comments'],
      });

      if (!queryUser) {
        throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
      }

      const user: UserProfile = {
        username: queryUser.username,
        name: queryUser.name,
        image_url: queryUser.image_url,
        bio: queryUser.bio,
        articles: queryArticle,
        comments: queryUser.comments as unknown as Comment[],
      };

      if (!req.user) {
        return user;
      }

      const isFollowed = await this.followRepo.findOne({
        where: {
          userBeingFollowed: username,
          userFollowingThePerson: req.user.id,
        },
      });

      if (isFollowed) {
        return { ...user, isFollowed: true };
      }
      return { ...user, isFollowed: false };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A publicly available method to follow a user based on username
   *
   */
  async followUser(@Req() req, username: string) {
    if (username === req.user.id) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidUser = await this.userRepo.findOne({
      where: {
        username: username,
      },
    });

    if (!isValidUser) {
      throw new HttpException(
        `User '${username}' not found `,
        HttpStatus.NOT_FOUND,
      );
    }

    const isUserFollowing = await this.followRepo.findOne({
      where: {
        userFollowingThePerson: req.user.id,
        userBeingFollowed: username,
      },
    });

    if (isUserFollowing) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const createFollow = this.followRepo.create({
        userFollowingThePerson: req.user.id,
        userBeingFollowed: isValidUser.username,
        followerUser: isValidUser,
        dateFollowed: new Date(),
      });

      await this.followRepo.save(createFollow);

      return {
        ok: true,
        message: 'User followed!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A publically available method to unfollow a user
   */
  async unfollowUser(@Req() req, username: string) {
    try {
      const follower = await this.followRepo.findOne({
        where: {
          userBeingFollowed: username,
          followerUser: req.user.id,
        },
      });
      await this.followRepo.remove(follower);
      return {
        ok: true,
        message: 'User unfollowed',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
