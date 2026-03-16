import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createUserSchema } from '../../../core/schemas/user.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent {
  createForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.createForm = this.fb.group({
      username: ['', [zodFieldValidator(createUserSchema, 'username')]],
      firstName: ['', [zodFieldValidator(createUserSchema, 'firstName')]],
      lastName: ['', [zodFieldValidator(createUserSchema, 'lastName')]],
      email: ['', [zodFieldValidator(createUserSchema, 'email')]],
      password: ['', [zodFieldValidator(createUserSchema, 'password')]],
      phone: ['', [zodFieldValidator(createUserSchema, 'phone')]],
    });
  }

  get username() {
    return this.createForm.get('username');
  }
  get firstName() {
    return this.createForm.get('firstName');
  }
  get lastName() {
    return this.createForm.get('lastName');
  }
  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  get phone() {
    return this.createForm.get('phone');
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.isLoading = true;
    this.userService.createUser(this.createForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('User berhasil dibuat!', 'Tutup', { duration: 3000 });
        this.router.navigate(['/user/create']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal membuat user.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
