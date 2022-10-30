import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  email: string;
  @IsOptional()
  @MaxLength(255)
  bio: string;
}
