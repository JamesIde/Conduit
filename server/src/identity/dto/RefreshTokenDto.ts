export interface RefreshTokenDto {
  ok: boolean;
  token: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}
