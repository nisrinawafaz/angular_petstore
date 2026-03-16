import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../core/models/order.model';

const DUMMY_ORDERS: Order[] = [
  {
    id: 1,
    petId: 101,
    quantity: 1,
    shipDate: '2026-03-01T10:00:00.000Z',
    status: 'placed',
    complete: false,
  },
  {
    id: 2,
    petId: 102,
    quantity: 2,
    shipDate: '2026-03-02T11:00:00.000Z',
    status: 'approved',
    complete: false,
  },
  {
    id: 3,
    petId: 103,
    quantity: 1,
    shipDate: '2026-03-03T12:00:00.000Z',
    status: 'delivered',
    complete: true,
  },
  {
    id: 4,
    petId: 104,
    quantity: 3,
    shipDate: '2026-03-04T09:00:00.000Z',
    status: 'placed',
    complete: false,
  },
  {
    id: 5,
    petId: 105,
    quantity: 1,
    shipDate: '2026-03-05T14:00:00.000Z',
    status: 'approved',
    complete: false,
  },
  {
    id: 6,
    petId: 106,
    quantity: 2,
    shipDate: '2026-03-06T15:00:00.000Z',
    status: 'delivered',
    complete: true,
  },
  {
    id: 7,
    petId: 107,
    quantity: 1,
    shipDate: '2026-03-07T08:00:00.000Z',
    status: 'placed',
    complete: false,
  },
  {
    id: 8,
    petId: 108,
    quantity: 4,
    shipDate: '2026-03-08T16:00:00.000Z',
    status: 'approved',
    complete: false,
  },
  {
    id: 9,
    petId: 109,
    quantity: 1,
    shipDate: '2026-03-09T10:30:00.000Z',
    status: 'delivered',
    complete: true,
  },
  {
    id: 10,
    petId: 110,
    quantity: 2,
    shipDate: '2026-03-10T13:00:00.000Z',
    status: 'placed',
    complete: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly BASE_URL = 'https://petstore.swagger.io/v2';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return of(DUMMY_ORDERS);
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.BASE_URL}/store/order/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.BASE_URL}/store/order`, order);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/store/order/${orderId}`);
  }
}
