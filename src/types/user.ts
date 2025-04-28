export type User = {
  name: string;
  userId: number;
  email: string;
  role_id: string;
  image_url: string;
};

export type AuthStatusResponse = {
  user: User | null;
};
