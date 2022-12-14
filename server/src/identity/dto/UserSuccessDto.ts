export interface UserSuccessDto {
  message?: string;
  user: {
    id?: number;
    username: string;
    email: string;
    image_url: string;
    bio: string;
  };
  token?: string;
}
