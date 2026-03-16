import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { PetCreateComponent } from './features/pet/pet-create/pet-create';
import { PetDetailComponent } from './features/pet/pet-detail/pet-detail';
import { PetEditComponent } from './features/pet/pet-edit/pet-edit';
import { PetListComponent } from './features/pet/pet-list/pet-list';
import { OrderCreateComponent } from './features/store/order-create/order-create';
import { OrderDetailComponent } from './features/store/order-detail/order-detail';
import { OrderListComponent } from './features/store/order-list/order-list';
import { UserCreateComponent } from './features/user/user-create/user-create.component';
import { UserDetailComponent } from './features/user/user-detail/user-detail';
import { UserEditComponent } from './features/user/user-edit/user-edit';
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
      { path: 'users/create', component: UserCreateComponent },
      { path: 'users/edit/:username', component: UserEditComponent },
      { path: 'users/:username', component: UserDetailComponent },
      { path: 'pets', component: PetListComponent },
      { path: 'pets/create', component: PetCreateComponent },
      { path: 'pets/edit/:id', component: PetEditComponent },
      { path: 'pets/:id', component: PetDetailComponent },
      { path: 'orders', component: OrderListComponent },
      { path: 'orders/create', component: OrderCreateComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
    ],
  },
];
