import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../components/confirm-dialog/confirm-dialog.component';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../services/user.service';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDividerModule,
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  isLoading = false;
  totalUsers = 0;
  pageSize = 5;
  pageIndex = 0;
  displayedColumns = [
    'username',
    'firstName',
    'lastName',
    'email',
    'phone',
    'userStatus',
    'actions',
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = data.length;
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat data user.', 'Tutup', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  updatePaginatedData(): void {
    const start = this.pageIndex * this.pageSize;
    this.paginatedUsers = this.users.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  openCreate(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  openEdit(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: { mode: 'edit', user },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  openDetail(user: User): void {
    this.dialog.open(UserDetailDialogComponent, {
      width: '480px',
      data: { user },
    });
  }

  openDelete(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Hapus User',
        message: `Yakin ingin menghapus user <strong>${user.username}</strong>?`,
        subMessage: 'Tindakan ini tidak dapat dibatalkan.',
        confirmLabel: 'Hapus',
        confirmColor: 'warn',
      } as ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.username).subscribe({
          next: () => {
            this.snackBar.open('User berhasil dihapus!', 'Tutup', { duration: 3000 });
            this.loadUsers();
          },
          error: () => this.snackBar.open('Gagal menghapus user.', 'Tutup', { duration: 3000 }),
        });
      }
    });
  }
}
