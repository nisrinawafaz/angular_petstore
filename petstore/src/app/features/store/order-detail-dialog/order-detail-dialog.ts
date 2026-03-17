import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseDialogComponent } from '../../../components/base-dialog/base-dialog.component';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    BaseDialogComponent,
  ],
  templateUrl: './order-detail-dialog.html',
  styleUrls: ['./order-detail-dialog.css'],
})
export class OrderDetailDialogComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order },
  ) {}

  ngOnInit(): void {
    this.orderService.getOrderById(Number(this.data.order.id)).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal memuat data order.', 'Tutup', { duration: 3000 });
        this.dialogRef.close(false);
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
