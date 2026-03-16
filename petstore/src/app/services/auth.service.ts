import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { GeneralResponse } from '../core/models/general.model';
import { LoginRequest } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL = 'https://petstore.swagger.io/v2';
  private readonly SESSION_KEY = 'session_token';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<GeneralResponse> {
    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.get<GeneralResponse>(`${this.BASE_URL}/user/login`, { params }).pipe(
      tap((response) => {
        // Ekstrak angka di message sebagai "token" simulasi
        const token = response.message.split(':')[1];
        localStorage.setItem(this.SESSION_KEY, token);
        localStorage.setItem('username', credentials.username);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/user/logout`).pipe(
      tap(() => {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem('username');
      }),
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }
}
