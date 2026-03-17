import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { OrderService } from '../../../services/order.service';
import { PetService } from '../../../services/pet.service';
import { OrderFormDialogComponent } from './order-form-dialog';

describe('OrderFormDialogComponent', () => {
  let component: OrderFormDialogComponent;
  let fixture: ComponentFixture<OrderFormDialogComponent>;
  let orderService: { createOrder: ReturnType<typeof vi.fn> };
  let petService: { findByStatus: ReturnType<typeof vi.fn> };
  let dialogRef: { close: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const mockPets = [
    { id: 1, name: 'Buddy', status: 'available' as const, photoUrls: [] },
    { id: 2, name: 'Max', status: 'available' as const, photoUrls: [] },
  ];

  beforeEach(async () => {
    orderService = { createOrder: vi.fn().mockReturnValue(of({})) };
    petService = { findByStatus: vi.fn().mockReturnValue(of(mockPets)) };
    dialogRef = { close: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [OrderFormDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderService },
        { provide: PetService, useValue: petService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available pets on init', () => {
    expect(petService.findByStatus).toHaveBeenCalledWith(['available']);
    expect(component.pets.length).toBe(2);
  });

  it('should initialize form with default values', () => {
    expect(component.orderForm.get('quantity')?.value).toBe(1);
    expect(component.orderForm.get('status')?.value).toBe('placed');
    expect(component.orderForm.get('complete')?.value).toBe(false);
  });

  it('should not submit if pet not selected', () => {
    component.orderForm.get('pet')?.setValue(null);
    component.onSubmit();
    expect(orderService.createOrder).not.toHaveBeenCalled();
  });

  it('should call createOrder on valid submit', () => {
    component.orderForm.patchValue({
      pet: mockPets[0],
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    });
    component.onSubmit();
    expect(orderService.createOrder).toHaveBeenCalled();
  });

  it('should close dialog on success', () => {
    component.orderForm.patchValue({
      pet: mockPets[0],
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false,
    });
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
