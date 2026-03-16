import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../core/models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  getLovCategory(): Observable<Category[]> {
    return of([
      { id: 1, name: 'Dog' },
      { id: 2, name: 'Cat' },
      { id: 3, name: 'Bird' },
      { id: 4, name: 'Fish' },
      { id: 5, name: 'Rabbit' },
      { id: 6, name: 'Hamster' },
      { id: 7, name: 'Reptile' },
      { id: 8, name: 'Other' },
    ]);
  }
}
