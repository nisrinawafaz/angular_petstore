import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, Observable, startWith } from 'rxjs';
import { BaseDialogComponent } from '../../../components/base-dialog/base-dialog.component';
import { Category, Pet, PetStatus } from '../../../core/models/pet.model';
import { petSchema } from '../../../core/schemas/pet.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { CategoryService } from '../../../services/category.service';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-pet-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    BaseDialogComponent,
  ],
  templateUrl: './pet-form-dialog.html',
  styleUrls: ['./pet-form-dialog.css'],
})
export class PetFormDialogComponent implements OnInit {
  petForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  statusOptions: PetStatus[] = ['available', 'pending', 'sold'];
  categories: Category[] = [];
  filteredCategories$!: Observable<Category[]>;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PetFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; pet?: Pet },
  ) {
    this.isEdit = data.mode === 'edit';

    this.petForm = this.fb.group({
      name: [data.pet?.name || '', [zodFieldValidator(petSchema, 'name')]],
      category: [data.pet?.category ?? null],
      status: [data.pet?.status || 'available', [zodFieldValidator(petSchema, 'status')]],
      tags: this.fb.array(data.pet?.tags?.map((t) => this.fb.control(t.name)) || []),
      photoUrls: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.categoryService.getLovCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
        this._initCategoryFilter();

        if (this.isEdit && this.data.pet?.id) {
          this.isLoading = true;
          this.petService.findById(this.data.pet.id).subscribe({
            next: (pet) => {
              const matchedCategory =
                this.categories.find(
                  (c) => c.name.toLowerCase() === pet.category?.name?.toLowerCase(),
                ) ?? null;

              this.petForm.patchValue({
                name: pet.name,
                status: pet.status,
                category: matchedCategory,
              });

              this.tags.clear();
              pet.tags?.forEach((tag) => {
                this.tags.push(this.fb.control(tag.name));
              });

              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.snackBar.open('Gagal memuat data pet.', 'Tutup', { duration: 3000 });
              this.dialogRef.close(false);
            },
          });
        }
      },
    });
  }

  private _initCategoryFilter(): void {
    this.filteredCategories$ = this.petForm.get('category')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'object' ? value?.name : value;
        return this._filterCategory(name || '');
      }),
    );
  }

  private _filterCategory(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter((c) => c.name.toLowerCase().includes(filterValue));
  }

  displayCategory(category: Category): string {
    return category?.name || '';
  }

  get name() {
    return this.petForm.get('name');
  }
  get status() {
    return this.petForm.get('status');
  }
  get tags() {
    return this.petForm.get('tags') as FormArray;
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }
  removeTag(i: number): void {
    this.tags.removeAt(i);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  onSubmit(): void {
    if (this.petForm.invalid) return;
    this.isLoading = true;

    const val = this.petForm.value;
    const payload: Pet = {
      ...(this.isEdit && this.data.pet?.id ? { id: this.data.pet.id } : {}),
      name: val.name,
      status: val.status,
      photoUrls: [],
      category: val.category ?? undefined,
      tags: val.tags.filter((t: string) => t.trim()).map((t: string) => ({ name: t })),
    };

    const request$ = this.isEdit
      ? this.petService.updatePet(payload)
      : this.petService.addPet(payload);

    request$.subscribe({
      next: (pet) => {
        if (this.selectedFile && pet.id) {
          this.petService.uploadImage(pet.id, this.selectedFile).subscribe({
            next: () => this._onSuccess(),
            error: () => this._onSuccess('tersimpan tapi foto gagal diupload'),
          });
        } else {
          this._onSuccess();
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open(`Gagal ${this.isEdit ? 'mengupdate' : 'membuat'} pet.`, 'Tutup', {
          duration: 3000,
        });
      },
    });
  }

  private _onSuccess(msg?: string): void {
    this.isLoading = false;
    this.snackBar.open(msg ?? `Pet berhasil ${this.isEdit ? 'diupdate' : 'dibuat'}!`, 'Tutup', {
      duration: 3000,
    });
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
