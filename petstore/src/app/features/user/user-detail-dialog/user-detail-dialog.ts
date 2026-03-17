import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseDialogComponent } from '../../../components/base-dialog/base-dialog.component';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    BaseDialogComponent,
  ],
  templateUrl: './user-detail-dialog.html',
  styleUrls: ['./user-detail-dialog.css'],
})
export class UserDetailDialogComponent implements OnInit {
  user: User | null = null;
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<UserDetailDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
  ) {}

  ngOnInit(): void {
    const username = this.data.user.username;
    this.userService.getUserByUsername(username).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat detail user.', 'Tutup', { duration: 3000 });
        this.dialogRef.close();
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
