import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../components/confirm-dialog/confirm-dialog.component';
import { Pet, PetStatus } from '../../../core/models/pet.model';
import { PetService } from '../../../services/pet.service';
import { PetDetailDialogComponent } from '../pet-detail-dialog/pet-detail-dialog';
import { PetFormDialogComponent } from '../pet-form-dialog/pet-form-dialog';

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
    MatTooltipModule,
    MatPaginatorModule,
    MatDividerModule,
  ],
  templateUrl: './pet-list.html',
  styleUrls: ['./pet-list.css'],
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  paginatedPets: Pet[] = [];
  isLoading = false;
  selectedStatuses: PetStatus[] = ['available'];
  displayedColumns = ['name', 'category', 'status', 'actions'];
  statusOptions: PetStatus[] = ['available', 'pending', 'sold'];
  totalPets = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private petService: PetService,
    private dialog: MatDialog,
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
    this.paginatedPets = this.pets.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadPets();
  }

  openCreate(): void {
    const ref = this.dialog.open(PetFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadPets();
    });
  }

  openEdit(pet: Pet): void {
    const ref = this.dialog.open(PetFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', pet },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadPets();
    });
  }

  openDetail(pet: Pet): void {
    this.dialog.open(PetDetailDialogComponent, {
      width: '500px',
      data: { pet },
    });
  }

  openDelete(pet: Pet): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Hapus Pet',
        message: `Yakin ingin menghapus pet <strong>${pet.name}</strong>?`,
        subMessage: 'Tindakan ini tidak dapat dibatalkan.',
        confirmLabel: 'Hapus',
        confirmColor: 'warn',
      } as ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.petService.deletePet(pet.id!).subscribe({
          next: () => {
            this.snackBar.open('Pet berhasil dihapus!', 'Tutup', { duration: 3000 });
            this.loadPets();
          },
          error: () => this.snackBar.open('Gagal menghapus pet.', 'Tutup', { duration: 3000 }),
        });
      }
    });
  }
}
