import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail',
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
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css'],
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.userService.getUserByUsername(username).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat detail user.', 'Tutup', { duration: 3000 });
        this.router.navigate(['/users']);
      },
    });
  }

  goToEdit(): void {
    this.router.navigate(['/users/edit', this.user?.username]);
  }

  deleteUser(): void {
    if (!confirm(`Yakin ingin menghapus user "${this.user?.username}"?`)) return;
    this.userService.deleteUser(this.user!.username).subscribe({
      next: () => {
        this.snackBar.open('User berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.snackBar.open('Gagal menghapus user.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
