import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFormDialog } from './pet-form-dialog';

describe('PetFormDialog', () => {
  let component: PetFormDialog;
  let fixture: ComponentFixture<PetFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
