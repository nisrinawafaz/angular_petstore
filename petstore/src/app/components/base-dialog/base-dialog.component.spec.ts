import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { BaseDialogComponent } from './base-dialog.component';

describe('BaseDialogComponent', () => {
  let component: BaseDialogComponent;
  let fixture: ComponentFixture<BaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDialogComponent, NoopAnimationsModule, MatDialogModule],
    })
      .overrideComponent(BaseDialogComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.mode).toBe('form');
    expect(component.title).toBe('');
    expect(component.confirmLabel).toBe('Simpan');
    expect(component.closeLabel).toBe('Tutup');
    expect(component.isLoading).toBe(false);
    expect(component.isFormInvalid).toBe(false);
  });

  it('should emit confirm event', () => {
    const confirmSpy = vi.fn();
    component.confirm.subscribe(confirmSpy);
    component.confirm.emit();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event', () => {
    const cancelSpy = vi.fn();
    component.cancel.subscribe(cancelSpy);
    component.cancel.emit();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should accept mode detail input', () => {
    component.mode = 'detail';
    expect(component.mode).toBe('detail');
  });

  it('should accept title input', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should accept isLoading input', () => {
    component.isLoading = true;
    expect(component.isLoading).toBe(true);
  });

  it('should accept isFormInvalid input', () => {
    component.isFormInvalid = true;
    expect(component.isFormInvalid).toBe(true);
  });
});
