export interface UserInterface {
  id: number;
  username: string;
  email: string;
  birthday: Date;
  passwordHash: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: Date;
}
