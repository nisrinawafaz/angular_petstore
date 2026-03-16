import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../services/order.service';

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
  displayedColumns = ['id', 'petId', 'quantity', 'shipDate', 'status', 'complete', 'actions'];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
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

  goToCreate(): void {
    this.router.navigate(['/orders/create']);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  deleteOrder(id: number): void {
    if (!confirm('Yakin ingin menghapus order ini?')) return;
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.snackBar.open('Order berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.loadOrders();
      },
      error: () => {
        this.snackBar.open('Gagal menghapus order.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
