import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type DialogMode = 'form' | 'detail';

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.css'],
})
export class BaseDialogComponent {
  @Input() mode: DialogMode = 'form';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() confirmLabel = 'Simpan';
  @Input() closeLabel = 'Tutup';
  @Input() isLoading = false;
  @Input() isFormInvalid = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
