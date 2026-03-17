import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { login: vi.fn() };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty credentials initially', () => {
    expect(component.credentials.username).toBe('');
    expect(component.credentials.password).toBe('');
  });

  it('should navigate to orders on successful login', () => {
    authService.login.mockReturnValue(
      of({
        code: 200,
        type: 'unknown',
        message: 'logged in user session:abc123',
      }),
    );

    component.credentials = { username: 'user1', password: 'pass1' };
    component.onLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });

  it('should set errorMessage on failed login', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.credentials = { username: 'wrong', password: 'wrong' };
    component.onLogin();

    expect(component.errorMessage).toBeTruthy();
    expect(component.isLoading).toBe(false);
  });
});
