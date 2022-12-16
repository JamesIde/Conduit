export interface RefreshTokenDto {
  ok: boolean;
  token: string;
}

export interface JWTPayload {
  sub: number;
  iat: number;
  id: number;
  username: string;
  socialLogin: boolean;
  providerName: string;
  tokenVersion?: string;
}
