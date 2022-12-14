import { IsNotEmpty } from 'class-validator';
import { IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  confirmPassword: string;
}
