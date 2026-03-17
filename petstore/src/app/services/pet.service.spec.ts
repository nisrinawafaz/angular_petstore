import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PetService } from './pet.service';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;

  const mockPet = {
    id: 1,
    name: 'Buddy',
    status: 'available' as const,
    photoUrls: [],
    tags: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService],
    });
    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add pet via POST', () => {
    service.addPet(mockPet).subscribe((res) => {
      expect(res.name).toBe('Buddy');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet'));
    expect(req.request.method).toBe('POST');
    req.flush(mockPet);
  });

  it('should update pet via PUT', () => {
    service.updatePet(mockPet).subscribe((res) => {
      expect(res.name).toBe('Buddy');
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockPet);
  });

  it('should find pets by status via GET', () => {
    service.findByStatus(['available']).subscribe((pets) => {
      expect(pets.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet/findByStatus'));
    expect(req.request.method).toBe('GET');
    req.flush([mockPet]);
  });

  it('should find pet by id via GET', () => {
    service.findById(1).subscribe((pet) => {
      expect(pet.id).toBe(1);
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  it('should delete pet via DELETE', () => {
    service.deletePet(1).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should upload image via POST', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    service.uploadImage(1, file).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne((r) => r.url.includes('/pet/1/uploadImage'));
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
