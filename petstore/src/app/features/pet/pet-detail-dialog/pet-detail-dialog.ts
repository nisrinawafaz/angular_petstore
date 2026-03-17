import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseDialogComponent } from '../../../components/base-dialog/base-dialog.component';
import { Pet } from '../../../core/models/pet.model';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-pet-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    BaseDialogComponent,
  ],
  templateUrl: './pet-detail-dialog.html',
  styleUrls: ['./pet-detail-dialog.css'],
})
export class PetDetailDialogComponent implements OnInit {
  pet: Pet | null = null;
  isLoading = true;

  constructor(
    private petService: PetService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PetDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pet: Pet },
  ) {}

  ngOnInit(): void {
    this.petService.findById(Number(this.data.pet.id)).subscribe({
      next: (data) => {
        this.pet = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Gagal memuat data pet.', 'Tutup', { duration: 3000 });
        this.dialogRef.close(false);
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
