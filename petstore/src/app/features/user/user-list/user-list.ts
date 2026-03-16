import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';
import { User } from '../../../core/models/user.model';

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

  goToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  goToDetail(username: string): void {
    this.router.navigate(['/users', username]);
  }

  goToEdit(username: string): void {
    this.router.navigate(['/users/edit', username]);
  }

  deleteUser(username: string): void {
    if (!confirm(`Yakin ingin menghapus user "${username}"?`)) return;
    this.userService.deleteUser(username).subscribe({
      next: () => {
        this.snackBar.open('User berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.loadUsers();
      },
      error: () => {
        this.snackBar.open('Gagal menghapus user.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
