import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css'],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat detail order.', 'Tutup', { duration: 3000 });
        this.router.navigate(['/orders']);
      },
    });
  }

  deleteOrder(): void {
    if (!confirm('Yakin ingin menghapus order ini?')) return;
    this.orderService.deleteOrder(this.order!.id!).subscribe({
      next: () => {
        this.snackBar.open('Order berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.snackBar.open('Gagal menghapus order.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
