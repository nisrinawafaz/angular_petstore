import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, NoopAnimationsModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu items', () => {
    expect(component.menuItems.length).toBeGreaterThan(0);
  });

  it('should have pets menu item', () => {
    const pets = component.menuItems.find((m) => m.route === '/pets');
    expect(pets).toBeDefined();
  });

  it('should have orders menu item', () => {
    const orders = component.menuItems.find((m) => m.route === '/orders');
    expect(orders).toBeDefined();
  });

  it('should have users menu item', () => {
    const users = component.menuItems.find((m) => m.route === '/users');
    expect(users).toBeDefined();
  });
});
