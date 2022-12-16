import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/identity/entities/User';
import * as jwt from 'jsonwebtoken';
import { JWTPayload } from 'src/identity/dto/RefreshTokenDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AccessTokenSuccess, RefreshTokenSuccess } from './models/Token';
/*
       ___          _________             _____ ____   ____  _  _______ ______  _____ 
      | \ \        / /__   __|   ___     / ____/ __ \ / __ \| |/ /_   _|  ____|/ ____|
      | |\ \  /\  / /   | |     ( _ )   | |   | |  | | |  | | ' /  | | | |__  | (___  
  _   | | \ \/  \/ /    | |     / _ \/\ | |   | |  | | |  | |  <   | | |  __|  \___ \ 
 | |__| |  \  /\  /     | |    | (_>  < | |___| |__| | |__| | . \ _| |_| |____ ____) |
  \____/    \/  \/      |_|     \___/\/  \_____\____/ \____/|_|\_\_____|______|_____/                                                                   
 */

@Injectable()
export class HelperService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {}
  /**
   * A method to call to generate a jwt access token
   */
  public async generateAccessToken(user: User): Promise<AccessTokenSuccess> {
    let payload: JWTPayload = {
      sub: user.id,
      iat: Date.now(),
      id: user.id,
      username: user.username,
      socialLogin: user.socialLogin,
      providerName: user.providerName ? user.providerName : 'local',
    };
    try {
      let token = jwt.sign(
        payload,
        this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        { expiresIn: '15min' },
      );
      return {
        ok: true,
        accessToken: token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to call to generate a refresh token
   */
  public async generateRefreshToken(user: User): Promise<RefreshTokenSuccess> {
    let payload: JWTPayload = {
      sub: user.id,
      iat: Date.now(),
      id: user.id,
      username: user.username,
      socialLogin: user.socialLogin,
      providerName: user.providerName ? user.providerName : 'local',
    };
    try {
      let token = jwt.sign(
        payload,
        this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        {
          expiresIn: '7day',
        },
      );
      return {
        ok: true,
        refreshToken: token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to send a cookie with the refresh token
   */
  public async sendRefreshCookie(@Res() res, user: User) {
    if (!user) {
      throw new HttpException(
        'Please ensure a user is provided',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let refreshToken = await this.generateRefreshToken(user);

    if (!refreshToken.ok) {
      throw new HttpException(
        'Something went wrong generating the refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    res.cookie('safron', refreshToken.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: 'none',
      secure: true,
    });
  }

  /**
   * A public method to refresh the access token using refresh token stored in cookies
   */
  public async refreshAccessToken(@Req() req: Request) {
    if (!req.cookies.safron) {
      throw new HttpException(
        'No cookie found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let token = req.cookies.safron;

    let payload;

    try {
      payload = jwt.verify(
        token,
        this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      );
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Find user with credentials relation
    let isValidUser = await this.userRepo.findOne({
      where: [
        { id: payload?.id },
        {
          providerId: payload?.id.toString(),
        },
      ],
      relations: {
        credentials: true,
      },
    });

    if (!isValidUser) {
      throw new HttpException('Invalid operation', HttpStatus.UNAUTHORIZED);
    }
    // Check token version to prevent session manipulation
    if (isValidUser.credentials.tokenVersion !== payload.tokenVersion) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return {
      ok: true,
      accessToken: await this.generateAccessToken(isValidUser),
    };
  }

  /**
   * A public method to revoke the refresh token from the cookie
   */
  public async revokeRefreshToken(@Req() req) {
    let token = req.cookies.safron;
    let payload;

    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Find user with credentials relation
    let isValidUser = await this.userRepo.findOne({
      where: {
        id: payload.id,
      },
      relations: {
        credentials: true,
      },
    });

    if (!isValidUser) {
      throw new HttpException('Invalid operation', HttpStatus.UNAUTHORIZED);
    }
    // Check token version to prevent session manipulation
    if (isValidUser.credentials.tokenVersion !== payload.tokenVersion) {
      throw new HttpException(
        'Invalid token credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Revoke the refresh token
    isValidUser.credentials.tokenVersion =
      isValidUser.credentials.tokenVersion + 1;
    await this.userRepo.save(isValidUser);
    return {
      ok: true,
      message: 'Refresh token revoked',
    };
  }
}
