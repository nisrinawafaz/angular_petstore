import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Pet, PetStatus } from '../../../core/models/pet.model';
import { PetService } from '../../../services/pet.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
  ],
  templateUrl: './pet-list.html',
  styleUrls: ['./pet-list.css'],
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  isLoading = false;
  selectedStatuses: PetStatus[] = ['available'];
  displayedColumns = ['id', 'name', 'category', 'status', 'actions'];

  statusOptions: PetStatus[] = ['available', 'pending', 'sold'];

  totalPets = 0;
  pageSize = 10;
  pageIndex = 0;
  paginatedPets: Pet[] = [];

  constructor(
    private petService: PetService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.petService.findByStatus(this.selectedStatuses).subscribe({
      next: (data) => {
        this.pets = data;
        this.totalPets = data.length;
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Gagal memuat data pet.', 'Tutup', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  updatePaginatedData(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPets = this.pets.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  onStatusChange(): void {
    this.loadPets();
  }

  goToCreate(): void {
    this.router.navigate(['/pets/create']);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/pets', id]);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/pets/edit', id]);
  }

  deletePet(id: number): void {
    if (!confirm('Yakin ingin menghapus pet ini?')) return;

    this.petService.deletePet(id).subscribe({
      next: () => {
        this.snackBar.open('Pet berhasil dihapus!', 'Tutup', { duration: 3000 });
        this.loadPets();
      },
      error: () => {
        this.snackBar.open('Gagal menghapus pet.', 'Tutup', { duration: 3000 });
      },
    });
  }
}
