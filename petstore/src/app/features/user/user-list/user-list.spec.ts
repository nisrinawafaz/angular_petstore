import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UserService } from '../../../services/user.service';
import { UserListComponent } from './user-list';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: {
    getUsers: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const mockUsers = [
    {
      id: 1,
      username: 'user1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@email.com',
      password: 'pass',
      phone: '08123',
      userStatus: 1,
    },
    {
      id: 2,
      username: 'user2',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@email.com',
      password: 'pass',
      phone: '08456',
      userStatus: 1,
    },
  ];

  beforeEach(async () => {
    userService = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
      deleteUser: vi.fn(),
    };
    dialog = { open: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('should open create dialog', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(false) });
    component.openCreate();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open edit dialog', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(false) });
    component.openEdit(mockUsers[0]);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open detail dialog', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(null) });
    component.openDetail(mockUsers[0]);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should delete user after confirm', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(true) });
    userService.deleteUser.mockReturnValue(of({}));
    component.openDelete(mockUsers[0]);
    expect(userService.deleteUser).toHaveBeenCalledWith('user1');
  });

  it('should update page on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 2 } as any);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
  });
});
