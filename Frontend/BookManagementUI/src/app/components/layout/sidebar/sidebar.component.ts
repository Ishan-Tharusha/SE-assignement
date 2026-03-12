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
  template: `
    <aside class="sidebar-shell" [class.sidebar-collapsed]="isCollapsed()">

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.name) {
          <a [routerLink]="item.route"
             routerLinkActive="nav-item-active"
             [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
             class="nav-item"
             [title]="isCollapsed() ? item.name : ''">

            <lucide-icon [name]="item.icon" class="nav-icon" style="width:18px;height:18px;flex-shrink:0;"></lucide-icon>

            @if (!isCollapsed()) {
              <span class="nav-label">{{ item.name }}</span>
            }

            @if (isCollapsed()) {
              <div class="tooltip">{{ item.name }}</div>
            }
          </a>
        }
      </nav>

      <!-- Collapse Toggle -->
      <button class="collapse-btn" (click)="toggleSidebar()" title="Toggle sidebar">
        @if (isCollapsed()) {
          <lucide-icon name="chevron-right" style="width:14px;height:14px;"></lucide-icon>
        } @else {
          <lucide-icon name="chevron-left" style="width:14px;height:14px;"></lucide-icon>
        }
      </button>


    </aside>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .sidebar-shell {
      width: 240px;
      height: 100%;
      background: #fff;
      border-right: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      padding: 16px 12px;
      transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .sidebar-collapsed {
      width: 68px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 8px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 10px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #6B7280;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
    }

    .nav-item:hover {
      background: #F3F4F6;
      color: #111827;
    }

    .nav-item-active {
      background: rgba(37,99,235,0.08) !important;
      color: #2563EB !important;
      font-weight: 600;
    }

    .nav-icon { color: inherit; }

    .nav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Tooltip shown when collapsed */
    .tooltip {
      position: absolute;
      left: 58px;
      top: 50%;
      transform: translateY(-50%);
      background: #1F2937;
      color: #fff;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
      z-index: 100;
      display: none;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .nav-item:hover .tooltip { display: block; }

    /* Collapse toggle button */
    .collapse-btn {
      position: absolute;
      top: 24px;
      right: -12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #E5E7EB;
      color: #9CA3AF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      transition: color 0.15s, border-color 0.15s;
    }

    .collapse-btn:hover {
      color: #2563EB;
      border-color: #2563EB;
    }

    .sidebar-footer { margin-top: auto; }

    .divider {
      height: 1px;
      background: #F3F4F6;
      margin: 12px 0;
    }
  `]
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
