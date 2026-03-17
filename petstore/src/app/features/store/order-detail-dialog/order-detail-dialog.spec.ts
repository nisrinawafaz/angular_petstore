import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { OrderDetailDialogComponent } from './order-detail-dialog';

describe('OrderDetailDialogComponent', () => {
  let component: OrderDetailDialogComponent;
  let fixture: ComponentFixture<OrderDetailDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const mockOrder = {
    id: 1,
    petId: 101,
    petName: 'Buddy',
    quantity: 1,
    shipDate: '2026-03-01T10:00:00.000Z',
    status: 'placed' as const,
    complete: false,
  };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [OrderDetailDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { order: mockOrder } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on onClose()', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
