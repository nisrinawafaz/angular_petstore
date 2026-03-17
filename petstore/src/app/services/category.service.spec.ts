import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of categories', () => {
    service.getLovCategory().subscribe((categories) => {
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  it('should return categories with id and name', () => {
    service.getLovCategory().subscribe((categories) => {
      categories.forEach((c) => {
        expect(c.id).toBeDefined();
        expect(c.name).toBeDefined();
      });
    });
  });
});
