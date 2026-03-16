import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetCreate } from './pet-create';

describe('PetCreate', () => {
  let component: PetCreate;
  let fixture: ComponentFixture<PetCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(PetCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
