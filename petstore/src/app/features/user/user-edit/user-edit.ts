import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { editUserSchema } from '../../../core/schemas/user.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.css'],
})
export class UserEditComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;
  isFetching = true;
  hidePassword = true;
  username!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [zodFieldValidator(editUserSchema, 'firstName')]],
      lastName: ['', [zodFieldValidator(editUserSchema, 'lastName')]],
      email: ['', [zodFieldValidator(editUserSchema, 'email')]],
      phone: ['', [zodFieldValidator(editUserSchema, 'phone')]],
      password: ['', [zodFieldValidator(editUserSchema, 'password')]],
      confirmPassword: ['', [zodFieldValidator(editUserSchema, 'confirmPassword')]],
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.userService.getUserByUsername(this.username).subscribe({
      next: (user) => {
        this.editForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        });
        this.isFetching = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat data user.', 'Tutup', { duration: 3000 });
        this.router.navigate(['/users']);
      },
    });
  }

  get firstName() {
    return this.editForm.get('firstName');
  }
  get lastName() {
    return this.editForm.get('lastName');
  }
  get email() {
    return this.editForm.get('email');
  }
  get phone() {
    return this.editForm.get('phone');
  }
  get password() {
    return this.editForm.get('password');
  }
  get confirmPassword() {
    return this.editForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;
    this.isLoading = true;
    const val = this.editForm.value;

    this.userService
      .updateUser(this.username, {
        username: this.username,
        firstName: val.firstName,
        lastName: val.lastName,
        email: val.email,
        phone: val.phone,
        password: val.password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('User berhasil diupdate!', 'Tutup', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Gagal mengupdate user.', 'Tutup', { duration: 3000 });
        },
      });
  }
}
