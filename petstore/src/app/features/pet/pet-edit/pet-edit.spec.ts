import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetEdit } from './pet-edit';

describe('PetEdit', () => {
  let component: PetEdit;
  let fixture: ComponentFixture<PetEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(PetEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
