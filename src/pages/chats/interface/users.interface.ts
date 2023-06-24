

export interface messages {
  content: string;
  id: string;
  user: User[];
}

export interface User {
  email: string;
  id: string;
  username: string;
}