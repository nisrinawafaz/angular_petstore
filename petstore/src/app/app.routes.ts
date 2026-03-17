import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { PetListComponent } from './features/pet/pet-list/pet-list';
import { OrderListComponent } from './features/store/order-list/order-list';
import { UserListComponent } from './features/user/user-list/user-list';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'pets', component: PetListComponent },
      { path: 'orders', component: OrderListComponent },
    ],
  },
];
