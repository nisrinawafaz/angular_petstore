import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { z } from 'zod';
import { OrderStatus } from '../../../core/models/order.model';
import { Pet as PetModel } from '../../../core/models/pet.model';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { OrderService } from '../../../services/order.service';
import { PetService } from '../../../services/pet.service';

const orderSchema = z.object({
  quantity: z.number({ error: 'Quantity wajib diisi' }).min(1, 'Minimal 1'),
  shipDate: z.string().min(1, 'Ship date wajib diisi'),
  status: z.enum(['placed', 'approved', 'delivered'] as const, {
    message: 'Status wajib dipilih',
  }),
});

@Component({
  selector: 'app-order-create',
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
  ],
  templateUrl: './order-create.html',
  styleUrls: ['./order-create.css'],
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  isLoading = false;
  statusOptions: OrderStatus[] = ['placed', 'approved', 'delivered'];

  pets: PetModel[] = [];
  filteredPets$!: Observable<PetModel[]>;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private petService: PetService,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.orderForm = this.fb.group({
      pet: [null],
      quantity: [1, [zodFieldValidator(orderSchema, 'quantity')]],
      shipDate: [new Date().toISOString(), [zodFieldValidator(orderSchema, 'shipDate')]],
      status: ['placed', [zodFieldValidator(orderSchema, 'status')]],
      complete: [false],
    });
  }

  ngOnInit(): void {
    this.petService.findByStatus(['available']).subscribe({
      next: (data) => {
        this.pets = data;
        this._initPetFilter();
      },
    });
  }

  private _initPetFilter(): void {
    this.filteredPets$ = this.orderForm.get('pet')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'object' ? value?.name : value;
        return this._filterPet(name || '');
      }),
    );
  }

  private _filterPet(value: string): PetModel[] {
    const filterValue = value.toLowerCase();
    return this.pets.filter((p) => p.name.toLowerCase().includes(filterValue));
  }

  displayPet(pet: PetModel): string {
    return pet?.name || '';
  }

  get quantity() {
    return this.orderForm.get('quantity');
  }
  get shipDate() {
    return this.orderForm.get('shipDate');
  }
  get status() {
    return this.orderForm.get('status');
  }
  get pet() {
    return this.orderForm.get('pet');
  }

  onSubmit(): void {
    if (this.orderForm.invalid) return;
    if (!this.orderForm.value.pet?.id) {
      this.snackBar.open('Pilih pet terlebih dahulu.', 'Tutup', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const val = this.orderForm.value;

    const payload = {
      petId: val.pet.id,
      quantity: val.quantity,
      shipDate: new Date(val.shipDate).toISOString(),
      status: val.status,
      complete: val.complete,
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Order berhasil dibuat!', 'Tutup', { duration: 3000 });
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal membuat order.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
