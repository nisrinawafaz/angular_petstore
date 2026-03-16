import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'app-pet-create',
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
  templateUrl: './pet-create.html',
  styleUrls: ['./pet-create.css'],
})
export class PetCreateComponent {
  petForm: FormGroup;
  isLoading = false;
  petId!: number;
  isUploading = false;
  selectedFile: File | null = null;
  statusOptions: PetStatus[] = ['available', 'pending', 'sold'];
  categories: Category[] = [];
  filteredCategories$!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    public router: Router,
    private route: ActivatedRoute,
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

  get name() {
    return this.petForm.get('name');
  }
  get status() {
    return this.petForm.get('status');
  }
  get tags() {
    return this.petForm.get('tags') as FormArray;
  }
  get photoUrls() {
    return this.petForm.get('photoUrls') as FormArray;
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
      name: val.name,
      status: val.status,
      photoUrls: [],
      category: val.category ?? undefined,
      tags: val.tags.filter((t: string) => t.trim()).map((t: string) => ({ name: t })),
    };

    this.petService.addPet(payload).subscribe({
      next: (pet) => {
        if (this.selectedFile && pet.id) {
          this.petService.uploadImage(pet.id, this.selectedFile).subscribe({
            next: () => {
              this.isLoading = false;
              this.snackBar.open('Pet berhasil dibuat!', 'Tutup', { duration: 3000 });
              this.router.navigate(['/pets']);
            },
            error: () => {
              this.isLoading = false;
              this.snackBar.open('Pet dibuat tapi gagal upload foto.', 'Tutup', { duration: 3000 });
              this.router.navigate(['/pets']);
            },
          });
        } else {
          this.isLoading = false;
          this.snackBar.open('Pet berhasil dibuat!', 'Tutup', { duration: 3000 });
          this.router.navigate(['/pets']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal membuat pet.', 'Tutup', { duration: 3000 });
      },
    });
  }

  displayCategory(category: Category): string {
    return category?.name || '';
  }
}
