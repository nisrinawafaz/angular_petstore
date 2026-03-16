import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Pets', icon: 'pets', route: '/pets' },
    { label: 'Orders', icon: 'shopping_cart', route: '/orders' },
    { label: 'Users', icon: 'group', route: '/users' },
  ];
}
