import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JWTPayload } from './dto/RefreshTokenDto';
@Injectable()
export class JWTGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

export const validateRequest = (request) => {
  let token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new HttpException('No identity presented', HttpStatus.UNAUTHORIZED);
  }

  try {
    let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    request.user = decodeToken;
  } catch (error) {
    throw new HttpException('Invalid token provided', HttpStatus.UNAUTHORIZED);
  }
  return true;
};
