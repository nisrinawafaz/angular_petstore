import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { UserDetailDialogComponent } from './user-detail-dialog';

describe('UserDetailDialogComponent', () => {
  let component: UserDetailDialogComponent;
  let fixture: ComponentFixture<UserDetailDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const mockUser = {
    id: 1,
    username: 'user1',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@email.com',
    password: 'pass',
    phone: '08123456789',
    userStatus: 1,
  };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UserDetailDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on onClose()', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
