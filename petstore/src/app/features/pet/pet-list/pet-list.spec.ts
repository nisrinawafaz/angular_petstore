import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PetService } from '../../../services/pet.service';
import { PetListComponent } from './pet-list';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let petService: { findByStatus: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const mockPets = [
    { id: 1, name: 'Buddy', status: 'available' as const, photoUrls: [] },
    { id: 2, name: 'Max', status: 'available' as const, photoUrls: [] },
  ];

  beforeEach(async () => {
    petService = { findByStatus: vi.fn().mockReturnValue(of(mockPets)) };
    dialog = { open: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PetListComponent, NoopAnimationsModule],
      providers: [
        { provide: PetService, useValue: petService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pets on init', () => {
    expect(petService.findByStatus).toHaveBeenCalled();
    expect(component.pets.length).toBeGreaterThan(0);
  });

  it('should update paginated data after load', () => {
    expect(component.paginatedPets.length).toBeGreaterThan(0);
  });

  // it('should show snackbar on load error', () => {
  //   petService.findByStatus.mockReturnValue(throwError(() => new Error('error')));
  //   component.loadPets();
  //   expect(snackBar.open).toHaveBeenCalled();
  // });

  // it('should open create dialog', () => {
  //   dialog.open.mockReturnValue({ afterClosed: () => of(false) });
  //   component.openCreate();
  //   expect(dialog.open).toHaveBeenCalled();
  // });

  // it('should reload after create dialog closes with true', () => {
  //   dialog.open.mockReturnValue({ afterClosed: () => of(true) });
  //   component.openCreate();
  //   expect(petService.findByStatus).toHaveBeenCalledTimes(2);
  // });
});
