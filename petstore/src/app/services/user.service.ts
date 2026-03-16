import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneralResponse } from '../core/models/general.model';
import { User } from '../core/models/user.model';

const DUMMY_USERS: User[] = [
  {
    id: 1,
    username: 'nisrinawafaz',
    firstName: 'nisrina',
    lastName: 'wafa',
    email: 'nisrina@gmail.com',
    password: 'admin123',
    phone: '0897652678992',
    userStatus: 1,
  },
  {
    id: 2,
    username: 'user1',
    firstName: 'Test',
    lastName: 'User',
    email: 'user1@email.com',
    password: 'password123',
    phone: '1234567890',
    userStatus: 1,
  },
];

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BASE_URL = 'https://petstore.swagger.io/v2';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return of(DUMMY_USERS);
  }

  createUser(user: User): Observable<GeneralResponse> {
    return this.http.post<GeneralResponse>(`${this.BASE_URL}/user`, user);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/user/${username}`);
  }

  updateUser(username: string, user: User): Observable<GeneralResponse> {
    return this.http.put<GeneralResponse>(`${this.BASE_URL}/user/${username}`, user);
  }

  deleteUser(username: string): Observable<GeneralResponse> {
    return this.http.delete<GeneralResponse>(`${this.BASE_URL}/user/${username}`);
  }
}
