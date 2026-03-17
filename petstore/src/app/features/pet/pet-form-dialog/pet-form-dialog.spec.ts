import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CategoryService } from '../../../services/category.service';
import { PetService } from '../../../services/pet.service';
import { PetFormDialogComponent } from './pet-form-dialog';

describe('PetFormDialogComponent', () => {
  let component: PetFormDialogComponent;
  let fixture: ComponentFixture<PetFormDialogComponent>;
  let petService: {
    addPet: ReturnType<typeof vi.fn>;
    updatePet: ReturnType<typeof vi.fn>;
    uploadImage: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
  };
  let categoryService: { getLovCategory: ReturnType<typeof vi.fn> };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const mockCategories = [
    { id: 1, name: 'Dog' },
    { id: 2, name: 'Cat' },
  ];

  const mockPet = {
    id: 1,
    name: 'Buddy',
    status: 'available' as const,
    photoUrls: [],
    tags: [{ name: 'cute' }],
    category: { id: 1, name: 'Dog' },
  };

  const setupComponent = async (mode: 'create' | 'edit', pet?: any) => {
    petService = {
      addPet: vi.fn().mockReturnValue(of(mockPet)),
      updatePet: vi.fn().mockReturnValue(of(mockPet)),
      uploadImage: vi.fn().mockReturnValue(of({})),
      findById: vi.fn().mockReturnValue(of(mockPet)),
    };
    categoryService = { getLovCategory: vi.fn().mockReturnValue(of(mockCategories)) };
    dialogRef = { close: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PetFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: PetService, useValue: petService },
        { provide: CategoryService, useValue: categoryService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MAT_DIALOG_DATA, useValue: { mode, pet } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('mode: create', () => {
    beforeEach(async () => await setupComponent('create'));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.petForm.get('name')?.value).toBe('');
      expect(component.petForm.get('status')?.value).toBe('available');
    });

    it('should load categories on init', () => {
      expect(categoryService.getLovCategory).toHaveBeenCalled();
      expect(component.categories.length).toBe(2);
    });

    it('should not submit if form is invalid', () => {
      component.petForm.get('name')?.setValue('');
      component.onSubmit();
      expect(petService.addPet).not.toHaveBeenCalled();
    });

    it('should call addPet on valid submit', () => {
      component.petForm.get('name')?.setValue('Buddy');
      component.onSubmit();
      expect(petService.addPet).toHaveBeenCalled();
    });

    it('should close dialog on success', () => {
      component.petForm.get('name')?.setValue('Buddy');
      component.onSubmit();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close dialog on cancel', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('mode: edit', () => {
    beforeEach(async () => await setupComponent('edit', mockPet));

    it('should create in edit mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEdit).toBe(true);
    });

    it('should initialize form with pet values', () => {
      expect(component.petForm.get('name')?.value).toBe('Buddy');
      expect(component.petForm.get('status')?.value).toBe('available');
    });

    it('should populate tags from pet', () => {
      expect(component.tags.length).toBe(1);
    });

    it('should call updatePet on valid submit', () => {
      component.petForm.get('name')?.setValue('Buddy Updated');
      component.onSubmit();
      expect(petService.updatePet).toHaveBeenCalled();
    });
  });
});
