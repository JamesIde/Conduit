import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @MaxLength(255)
  bio: string;
}
