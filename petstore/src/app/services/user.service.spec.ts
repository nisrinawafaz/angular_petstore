import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    username: 'user1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@email.com',
    password: 'Password1!',
    phone: '08123456789',
    userStatus: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dummy users from getUsers()', () => {
    service.getUsers().subscribe((users) => {
      expect(users.length).toBeGreaterThan(0);
    });
  });

  it('should create user via POST', () => {
    service.createUser(mockUser).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/user'));
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should get user by username via GET', () => {
    service.getUserByUsername('user1').subscribe((user) => {
      expect(user.username).toBe('user1');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/user/user1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update user via PUT', () => {
    service.updateUser('user1', mockUser).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/user/user1'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should delete user via DELETE', () => {
    service.deleteUser('user1').subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/user/user1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
