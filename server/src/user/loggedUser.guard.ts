import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTPayload } from './dto/RefreshTokenDto';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class LoggedUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return isUserPresent(request);
  }
}

/**
 * The idea of this guard is to simply pass the user to the request object.
 * The methods guarded by this guard will deal with the condition of the user being present or not.
 * It is different from @see JWTGuard in that it does not throw an error if the user is not present.
 * As a user can be present or not, this guard is used in the methods that can be accessed by both logged in and logged out users.
 */
export const isUserPresent = (request) => {
  let token = request.headers.authorization?.split(' ')[1];
  if (!token || token === 'null' || token === null) {
    return true;
  }

  try {
    let decodeToken: JWTPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    ) as JWTPayload;
    request.user = decodeToken.id;
  } catch (error) {
    throw new HttpException('Invalid token provided', HttpStatus.UNAUTHORIZED);
  }
  return true;
};
