import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Database, PlusCircle, ChevronLeft, ChevronRight, Home } from 'lucide-angular';

interface NavItem {
  name: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  providers: [
    { provide: 'lucide-icons', useValue: { LayoutDashboard, Database, PlusCircle, ChevronLeft, ChevronRight, Home } }
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = signal(false);

  navItems: NavItem[] = [
    { name: 'Dashboard',      icon: 'layout-dashboard', route: '/dashboard' },
    { name: 'Manage Records', icon: 'database',          route: '/books'     },
    { name: 'Add New Record', icon: 'plus-circle',       route: '/books/add' }
  ];

  constructor(public router: Router) {}

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }
}
