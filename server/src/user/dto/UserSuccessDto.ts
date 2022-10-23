export interface UserSuccessDto {
  message?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  token?: string;
}
