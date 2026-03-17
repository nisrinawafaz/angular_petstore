import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseDialogComponent } from '../../../components//base-dialog/base-dialog.component';
import { User } from '../../../core/models/user.model';
import { createUserSchema, editUserSchema } from '../../../core/schemas/user.schema';
import { zodFieldValidator } from '../../../core/validators/zod.validator';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    BaseDialogComponent,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrls: ['./user-form-dialog.css'],
})
export class UserFormDialogComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; user?: User },
  ) {
    this.isEdit = data.mode === 'edit';
    const schema = this.isEdit ? editUserSchema : createUserSchema;
    this.isLoading = this.isEdit ? true : false;

    this.userForm = this.fb.group({
      username: [
        { value: '', disabled: this.isEdit },
        [zodFieldValidator(createUserSchema, 'username')],
      ],
      firstName: ['', [zodFieldValidator(schema, 'firstName')]],
      lastName: ['', [zodFieldValidator(schema, 'lastName')]],
      email: ['', [zodFieldValidator(schema, 'email')]],
      phone: ['', [zodFieldValidator(schema, 'phone')]],
      password: ['', [zodFieldValidator(schema, 'password')]],
      confirmPassword: ['', [zodFieldValidator(schema, 'confirmPassword')]],
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.user?.username) {
      this.userService.getUserByUsername(this.data.user.username).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.userForm.patchValue({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
          });
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Gagal memuat data user.', 'Tutup', { duration: 3000 });
          this.dialogRef.close(false);
        },
      });
    }
  }

  get username() {
    return this.userForm.get('username');
  }
  get firstName() {
    return this.userForm.get('firstName');
  }
  get lastName() {
    return this.userForm.get('lastName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.isLoading = true;

    const val = this.userForm.getRawValue();
    const payload: User = {
      username: val.username,
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email,
      phone: val.phone,
      password: val.password,
    };

    const request$ = this.isEdit
      ? this.userService.updateUser(val.username, payload)
      : this.userService.createUser(payload);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(`User berhasil ${this.isEdit ? 'diupdate' : 'dibuat'}!`, 'Tutup', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open(`Gagal ${this.isEdit ? 'mengupdate' : 'membuat'} user.`, 'Tutup', {
          duration: 3000,
        });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
