export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};
