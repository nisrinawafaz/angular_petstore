import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Category, PetStatus } from '../../../core/models/pet.model';
import { petSchema } from '../../../core/schemas/pet.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { CategoryService } from '../../../services/category.service';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-pet-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './pet-edit.html',
  styleUrls: ['./pet-edit.css'],
})
export class PetEditComponent implements OnInit {
  petForm: FormGroup;
  isLoading = false;
  isFetching = true;
  selectedFile: File | null = null;
  statusOptions: PetStatus[] = ['available', 'pending', 'sold'];
  petId!: number;
  categories: Category[] = [];
  filteredCategories$!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
  ) {
    this.petForm = this.fb.group({
      name: ['', [zodFieldValidator(petSchema, 'name')]],
      category: [null],
      status: ['available', [zodFieldValidator(petSchema, 'status')]],
      tags: this.fb.array([]),
      photoUrls: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.petId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getLovCategory().subscribe({
      next: (data) => {
        this.categories = data;
        this._initCategoryFilter();
      },
    });

    this.loadPet();
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

  loadPet(): void {
    this.petService.findById(this.petId).subscribe({
      next: (pet) => {
        const matchedCategory =
          this.categories.find((c) => c.name.toLowerCase() === pet.category?.name?.toLowerCase()) ??
          null;

        this.petForm.patchValue({
          name: pet.name,
          category: matchedCategory,
          status: pet.status,
        });

        pet.tags?.forEach((tag) => {
          this.tags.push(this.fb.control(tag.name));
        });

        this.isFetching = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat data pet.', 'Tutup', { duration: 3000 });
        this.router.navigate(['/pets']);
      },
    });
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.petForm.invalid) return;

    this.isLoading = true;
    const val = this.petForm.value;

    const payload = {
      id: this.petId,
      name: val.name,
      status: val.status,
      photoUrls: [],
      category: val.category ?? undefined,
      tags: val.tags.filter((t: string) => t.trim()).map((t: string) => ({ name: t })),
    };

    this.petService.updatePet(payload).subscribe({
      next: (pet) => {
        if (this.selectedFile) {
          this.petService.uploadImage(pet.id!, this.selectedFile).subscribe({
            next: () => {
              this.isLoading = false;
              this.snackBar.open('Pet berhasil diupdate!', 'Tutup', { duration: 3000 });
              this.router.navigate(['/pets']);
            },
            error: () => {
              this.isLoading = false;
              this.snackBar.open('Pet diupdate tapi gagal upload foto.', 'Tutup', {
                duration: 3000,
              });
              this.router.navigate(['/pets']);
            },
          });
        } else {
          this.isLoading = false;
          this.snackBar.open('Pet berhasil diupdate!', 'Tutup', { duration: 3000 });
          this.router.navigate(['/pets']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal mengupdate pet.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
