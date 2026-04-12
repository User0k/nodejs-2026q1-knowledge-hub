export interface User {
  id: string;
  login: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: number;
  updatedAt: number;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
