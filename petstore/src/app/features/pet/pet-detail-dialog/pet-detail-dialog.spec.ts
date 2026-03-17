import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { PetDetailDialogComponent } from './pet-detail-dialog';

describe('PetDetailDialogComponent', () => {
  let component: PetDetailDialogComponent;
  let fixture: ComponentFixture<PetDetailDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const mockPet = {
    id: 1,
    name: 'Buddy',
    status: 'available' as const,
    photoUrls: [],
    tags: [],
  };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PetDetailDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { pet: mockPet } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailDialogComponent);
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
