import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, Pet, PetStatus } from '../core/models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly BASE_URL = 'https://petstore.swagger.io/v2';

  constructor(private http: HttpClient) {}

  addPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.BASE_URL}/pet`, pet);
  }

  updatePet(pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.BASE_URL}/pet`, pet);
  }

  findByStatus(statuses: PetStatus[]): Observable<Pet[]> {
    const params = new HttpParams().set('status', statuses.join(','));
    return this.http.get<Pet[]>(`${this.BASE_URL}/pet/findByStatus`, { params });
  }

  findById(petId: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.BASE_URL}/pet/${petId}`);
  }

  deletePet(petId: number, apiKey?: string): Observable<any> {
    const headers = new HttpHeaders(apiKey ? { api_key: apiKey } : {});
    return this.http.delete(`${this.BASE_URL}/pet/${petId}`, { headers });
  }

  uploadImage(petId: number, file: File, additionalMetadata?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (additionalMetadata) {
      formData.append('additionalMetadata', additionalMetadata);
    }
    return this.http.post(`${this.BASE_URL}/pet/${petId}/uploadImage`, formData);
  }

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
