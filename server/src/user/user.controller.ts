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
import { UserService } from './user.service';
import { LoginUserDto } from './dto/LoginUserDto';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { LoggedUserGuard } from './loggedUser.guard';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: HelperService,
  ) {}

  @Post('register')
  register(
    @Res({ passthrough: true }) res,
    @Body() registerUser: RegisterUserDto,
  ) {
    return this.userService.registerUser(res, registerUser);
  }

  @Post('login')
  login(@Res({ passthrough: true }) res, @Body() loginUser: LoginUserDto) {
    return this.userService.loginUser(res, loginUser);
  }

  @UseGuards(JWTGuard)
  @Put('profile')
  updateProfile(@Req() req: Request, @Body() updateProfile: UpdateProfileDto) {
    return this.userService.updateProfile(req, updateProfile);
  }

  // @UseGuards(JWTGuard)
  // @Get('profile')
  // loggedInUserProfile(@Req() req) {
  //   return this.userService.getProfile(req);
  // }

  @UseGuards(LoggedUserGuard)
  @Get('profile/:username')
  userProfile(@Req() req, @Param('username') username: string) {
    return this.userService.getUserProfile(req, username);
  }

  @UseGuards(JWTGuard)
  @Post('profile/:username/follow')
  followUser(@Req() req, @Param('username') username: string) {
    return this.userService.followUser(req, username);
  }

  @UseGuards(JWTGuard)
  @Delete('profile/:username/follow')
  unfollowUser(@Req() req, @Param('username') username: string) {
    return this.userService.unfollowUser(req, username);
  }

  @Get('all')
  getAll() {
    return this.userService.getAllUsers();
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
