import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrder = {
    id: 1,
    petId: 101,
    quantity: 1,
    shipDate: '2026-03-01T10:00:00.000Z',
    status: 'placed' as const,
    complete: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return dummy orders from getOrders()', () => {
    service.getOrders().subscribe((orders) => {
      expect(orders.length).toBe(10);
    });
  });

  it('should get order by id via GET', () => {
    service.getOrderById(1).subscribe((order) => {
      expect(order.id).toBe(1);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/store/order/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should create order via POST', () => {
    service.createOrder(mockOrder).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/store/order'));
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  it('should delete order via DELETE', () => {
    service.deleteOrder(1).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/store/order/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
