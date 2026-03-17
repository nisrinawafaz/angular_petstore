import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseDialogComponent } from '../../../components/base-dialog/base-dialog.component';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { Pet } from '../../../core/models/pet.model';
import { orderSchema } from '../../../core/schemas/order.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { OrderService } from '../../../services/order.service';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-order-form-dialog',
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    BaseDialogComponent,
  ],
  templateUrl: './order-form-dialog.html',
  styleUrls: ['./order-form-dialog.css'],
})
export class OrderFormDialogComponent implements OnInit {
  orderForm: FormGroup;
  isLoading = false;
  statusOptions: OrderStatus[] = ['placed', 'approved', 'delivered'];
  pets: Pet[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private petService: PetService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<OrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.orderForm = this.fb.group({
      pet: [null, [zodFieldValidator(orderSchema, 'pet')]],
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
      },
    });
  }

  displayPet(pet: Pet): string {
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

  onSubmit(): void {
    if (this.orderForm.invalid) return;
    if (!this.orderForm.value.pet?.id) {
      this.snackBar.open('Pilih pet terlebih dahulu.', 'Tutup', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const val = this.orderForm.value;

    const payload: Order = {
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
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal membuat order.', 'Tutup', { duration: 3000 });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
