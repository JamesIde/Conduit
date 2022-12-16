import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { HelperService } from 'src/helper/helper.service';
import { JWTGuard } from './auth.guard';
import { IdentityService } from './identity.service';
import { LoginUserDto } from './dto/LoginUserDto';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { LoggedUserGuard } from './loggedUser.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOauthGuard } from './strategies/google.guard';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly authService: HelperService,
  ) {}

  /**
   _____ _____ _______ _    _ _    _ ____     ____         _    _ _______ _    _ 
  / ____|_   _|__   __| |  | | |  | |  _ \   / __ \   /\  | |  | |__   __| |  | |
 | |  __  | |    | |  | |__| | |  | | |_) | | |  | | /  \ | |  | |  | |  | |__| |
 | | |_ | | |    | |  |  __  | |  | |  _ <  | |  | |/ /\ \| |  | |  | |  |  __  |
 | |__| |_| |_   | |  | |  | | |__| | |_) | | |__| / ____ \ |__| |  | |  | |  | |
  \_____|_____|  |_|  |_|  |_|\____/|____/   \____/_/    \_\____/   |_|  |_|  |_|
                                                                                                                                                              
 */

  @Get('idp/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('idp/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res({ passthrough: true }) res) {
    const resp = await this.authService.generateAccessToken(req.user);
    if (resp.ok) {
      this.authService.sendRefreshCookie(res, req.user);
      return resp;
    }
  }

  /**

    _____  ____   ____   _____ _      ______           _    _ _______ _    _ ______ _   _ _______ _____ _____       _______ _____ ____  _   _ 
  / ____|/ __ \ / __ \ / ____| |    |  ____|     /\  | |  | |__   __| |  | |  ____| \ | |__   __|_   _/ ____|   /\|__   __|_   _/ __ \| \ | |
 | |  __| |  | | |  | | |  __| |    | |__       /  \ | |  | |  | |  | |__| | |__  |  \| |  | |    | || |       /  \  | |    | || |  | |  \| |
 | | |_ | |  | | |  | | | |_ | |    |  __|     / /\ \| |  | |  | |  |  __  |  __| | . ` |  | |    | || |      / /\ \ | |    | || |  | | . ` |
 | |__| | |__| | |__| | |__| | |____| |____   / ____ \ |__| |  | |  | |  | | |____| |\  |  | |   _| || |____ / ____ \| |   _| || |__| | |\  |
  \_____|\____/ \____/ \_____|______|______| /_/    \_\____/   |_|  |_|  |_|______|_| \_|  |_|  |_____\_____/_/    \_\_|  |_____\____/|_| \_|
                                                                                                                                                                                                                                                                                                                               
 */
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(@Req() req, @Res({ passthrough: true }) res) {
    const resp = await this.authService.generateAccessToken(req.user);
    if (resp.ok) {
      this.authService.sendRefreshCookie(res, req.user);
      return resp;
    }
  }

  @Post('register')
  register(
    @Res({ passthrough: true }) res,
    @Body() registerUser: RegisterUserDto,
  ) {
    return this.identityService.registerUser(res, registerUser);
  }

  @Post('login')
  login(@Res({ passthrough: true }) res, @Body() loginUser: LoginUserDto) {
    return this.identityService.loginUser(res, loginUser);
  }

  @UseGuards(JWTGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() updateProfile: UpdateProfileDto) {
    return this.identityService.updateProfile(req, updateProfile);
  }

  // @UseGuards(JWTGuard)
  // @Get('profile')
  // loggedInUserProfile(@Req() req) {
  //   return this.identityService.getProfile(req);
  // }

  @UseGuards(LoggedUserGuard)
  @Get('profile/:username')
  userProfile(@Req() req, @Param('username') username: string) {
    return this.identityService.getUserProfile(req, username);
  }

  @UseGuards(JWTGuard)
  @Post('profile/:username/follow')
  followUser(@Req() req, @Param('username') username: string) {
    return this.identityService.followUser(req, username);
  }

  @UseGuards(JWTGuard)
  @Delete('profile/:username/follow')
  unfollowUser(@Req() req, @Param('username') username: string) {
    return this.identityService.unfollowUser(req, username);
  }

  @Get('refresh_token')
  refreshToken(@Req() req) {
    return this.authService.refreshAccessToken(req);
  }
  @Get('revoke_token')
  revokeToken(@Req() req) {
    return this.authService.revokeRefreshToken(req);
  }
}
