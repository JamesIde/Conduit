import { IsNotEmpty } from 'class-validator';

export class IdPToken {
  @IsNotEmpty()
  token: string;
}
