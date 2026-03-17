import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { OrderService } from '../../../services/order.service';
import { OrderListComponent } from './order-list';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let orderService: { getOrders: ReturnType<typeof vi.fn>; deleteOrder: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };
  let snackBar: { open: ReturnType<typeof vi.fn> };

  const mockOrders = [
    {
      id: 1,
      petId: 101,
      quantity: 1,
      shipDate: '2026-03-01T10:00:00.000Z',
      status: 'placed' as const,
      complete: false,
    },
    {
      id: 2,
      petId: 102,
      quantity: 2,
      shipDate: '2026-03-02T11:00:00.000Z',
      status: 'approved' as const,
      complete: false,
    },
  ];

  beforeEach(async () => {
    orderService = {
      getOrders: vi.fn().mockReturnValue(of(mockOrders)),
      deleteOrder: vi.fn(),
    };
    dialog = { open: vi.fn() };
    snackBar = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [OrderListComponent, NoopAnimationsModule],
      providers: [
        { provide: OrderService, useValue: orderService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(orderService.getOrders).toHaveBeenCalled();
    expect(component.orders.length).toBe(2);
  });

  it('should update paginated data after load', () => {
    expect(component.paginatedOrders.length).toBeGreaterThan(0);
  });

  it('should open create dialog', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(false) });
    component.openCreate();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open detail dialog', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(null) });
    component.openDetail(mockOrders[0]);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should reload after delete confirmed', () => {
    dialog.open.mockReturnValue({ afterClosed: () => of(true) });
    orderService.deleteOrder.mockReturnValue(of({}));
    component.openDelete(mockOrders[0]);
    expect(orderService.deleteOrder).toHaveBeenCalledWith(1);
  });

  it('should update page on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 2 } as any);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
  });
});
