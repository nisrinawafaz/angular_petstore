import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from '../../../core/models/pet.model';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './pet-detail.html',
  styleUrls: ['./pet-detail.css'],
})
export class PetDetailComponent implements OnInit {
  pet: Pet | null = null;
  isLoading = true;

  constructor(
    private petService: PetService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petService.findById(id).subscribe({
      next: (data) => {
        this.pet = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat detail pet.', 'Tutup', { duration: 3000 });
        this.router.navigate(['/pets']);
      },
    });
  }

  goToEdit(): void {
    this.router.navigate(['/pets/edit', this.pet?.id]);
  }

  deletePet(): void {
    if (!confirm('Yakin ingin menghapus pet ini?')) return;
    this.petService.deletePet(this.pet!.id!).subscribe({
      next: () => {
        this.snackBar.open('Pet berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.router.navigate(['/pets']);
      },
      error: () => {
        this.snackBar.open('Gagal menghapus pet.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
