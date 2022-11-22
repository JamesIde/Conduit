export interface UserSuccessDto {
  message?: string;
  user: {
    id?: number;
    username: string;
    email: string;
    image: string;
    bio: string;
  };
  token?: string;
}
