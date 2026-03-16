export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userStatus?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}
