import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {}
// https://medium.com/@flavtech/google-oauth2-authentication-with-nestjs-explained-ab585c53edec
