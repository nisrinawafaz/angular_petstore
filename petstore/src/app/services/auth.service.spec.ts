import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and save token to localStorage', () => {
    const mockResponse = {
      code: 200,
      type: 'unknown',
      message: 'logged in user session:abc123',
    };

    service.login({ username: 'user1', password: 'pass1' }).subscribe((res) => {
      expect(res.code).toBe(200);
      expect(localStorage.getItem('session_token')).toBe('abc123');
      expect(localStorage.getItem('username')).toBe('user1');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/user/login'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('session_token', 'abc123');
    localStorage.setItem('username', 'user1');

    service.logout().subscribe(() => {
      expect(localStorage.getItem('session_token')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
    });

    const req = httpMock.expectOne((r) => r.url.includes('/user/logout'));
    req.flush({});
  });

  it('should return true if logged in', () => {
    localStorage.setItem('session_token', 'abc123');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if not logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return username from localStorage', () => {
    localStorage.setItem('username', 'user1');
    expect(service.getUsername()).toBe('user1');
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('session_token', 'abc123');
    expect(service.getToken()).toBe('abc123');
  });
});
