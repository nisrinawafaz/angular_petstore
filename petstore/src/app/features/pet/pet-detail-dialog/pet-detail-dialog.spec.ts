import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetDetailDialog } from './pet-detail-dialog';

describe('PetDetailDialog', () => {
  let component: PetDetailDialog;
  let fixture: ComponentFixture<PetDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetDetailDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
