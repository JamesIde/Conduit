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

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    private readonly authService: HelperService,
  ) {}

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

// TODO Get logged in user following users
// TODO Get logged in user followers
