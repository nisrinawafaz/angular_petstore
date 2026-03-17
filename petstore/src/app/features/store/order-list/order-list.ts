import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../components/confirm-dialog/confirm-dialog.component';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../services/order.service';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog';
import { OrderFormDialogComponent } from '../order-form-dialog/order-form-dialog';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDividerModule,
  ],
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.css'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  paginatedOrders: Order[] = [];
  isLoading = false;
  totalOrders = 0;
  pageSize = 5;
  pageIndex = 0;
  displayedColumns = ['petName', 'quantity', 'shipDate', 'status', 'complete', 'actions'];

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.totalOrders = data.length;
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat data order.', 'Tutup', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  updatePaginatedData(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedOrders = this.orders.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  openCreate(): void {
    const ref = this.dialog.open(OrderFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadOrders();
    });
  }

  openDetail(order: Order): void {
    this.dialog.open(OrderDetailDialogComponent, {
      width: '480px',
      data: { order },
    });
  }

  openDelete(order: Order): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Hapus Order',
        message: `Yakin ingin menghapus order <strong>#${order.id}</strong>?`,
        subMessage: 'Tindakan ini tidak dapat dibatalkan.',
        confirmLabel: 'Hapus',
        confirmColor: 'warn',
      } as ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.orderService.deleteOrder(order.id!).subscribe({
          next: () => {
            this.snackBar.open('Order berhasil dihapus!', 'Tutup', { duration: 3000 });
            this.loadOrders();
          },
          error: () => this.snackBar.open('Gagal menghapus order.', 'Tutup', { duration: 3000 }),
        });
      }
    });
  }
}
