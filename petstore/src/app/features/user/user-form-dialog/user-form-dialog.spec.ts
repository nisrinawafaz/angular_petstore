import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { UserService } from '../../../services/user.service';
import { UserFormDialogComponent } from './user-form-dialog';

describe('UserFormDialogComponent', () => {
  let component: UserFormDialogComponent;
  let fixture: ComponentFixture<UserFormDialogComponent>;
  let userService: {
    createUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
    getUserByUsername: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

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

  const setupComponent = async (mode: 'create' | 'edit', user?: any) => {
    userService = {
      createUser: vi.fn().mockReturnValue(of({})),
      updateUser: vi.fn().mockReturnValue(of({})),
      getUserByUsername: vi.fn().mockReturnValue(of(mockUser)),
    };
    dialogRef = { close: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UserFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MAT_DIALOG_DATA, useValue: { mode, user } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('mode: create', () => {
    beforeEach(async () => await setupComponent('create'));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form', () => {
      expect(component.userForm.get('username')?.value).toBe('');
      expect(component.userForm.get('firstName')?.value).toBe('');
    });

    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it('should call createUser on valid submit', () => {
      component.userForm.patchValue({
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
        email: 'new@email.com',
        phone: '+6281234567890',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      });
      component.onSubmit();
      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should close dialog on success', () => {
      component.userForm.patchValue({
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
        email: 'new@email.com',
        phone: '+6281234567890',
        password: 'Password1!',
        confirmPassword: 'Password1!',
      });
      component.onSubmit();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    // it('should show snackbar on error', () => {
    //   userService.createUser.mockReturnValue(throwError(() => new Error('error')));
    //   component.userForm.patchValue({
    //     username: 'newuser',
    //     firstName: 'New',
    //     lastName: 'User',
    //     email: 'new@email.com',
    //     phone: '+6281234567890',
    //     password: 'Password1!',
    //     confirmPassword: 'Password1!',
    //   });
    //   component.onSubmit();
    //   expect(snackBar.open).toHaveBeenCalled();
    // });

    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('mode: edit', () => {
    beforeEach(async () => await setupComponent('edit', mockUser));

    it('should create in edit mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEdit).toBe(true);
    });

    it('should fetch user data on init', () => {
      expect(userService.getUserByUsername).toHaveBeenCalledWith('user1');
    });

    it('should patch form with user data', () => {
      expect(component.userForm.get('firstName')?.value).toBe('Test');
      expect(component.userForm.get('email')?.value).toBe('test@email.com');
    });

    it('should call updateUser on valid submit', () => {
      component.userForm.patchValue({
        password: 'Password1!',
        confirmPassword: 'Password1!',
      });
      component.onSubmit();
      expect(userService.updateUser).toHaveBeenCalled();
    });
  });
});
