import { Component } from '@angular/core';
import { LucideAngularModule, Bell, Search, User } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <header class="navbar-bar">
      <!-- Left: Brand + Search -->
      <div class="navbar-left">
        <div class="brand">
          <span class="brand-icon">📚</span>
          <span class="brand-text">BookAdmin</span>
        </div>

        <div class="search-wrapper">
          <span class="search-icon-wrap"><lucide-icon name="search" style="width:15px;height:15px;display:block;"></lucide-icon></span>
          <input type="text" placeholder="Search books, authors..." class="search-input" />
        </div>
      </div>

      <!-- Right: Actions + Profile -->
      <div class="navbar-right">
        <button class="icon-btn" title="Notifications">
          <lucide-icon name="bell" style="width:20px;height:20px;"></lucide-icon>
          <span class="notif-dot"></span>
        </button>

        <div class="divider-v"></div>

        <button class="profile-btn">
          <div class="avatar">IS</div>
          <div class="profile-info">
            <span class="profile-name">Admin User</span>
            <span class="profile-role">System Admin</span>
          </div>
        </button>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }

    .navbar-bar {
      position: sticky;
      top: 0;
      z-index: 30;
      width: 100%;
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      gap: 16px;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .brand-icon { font-size: 20px; }

    .brand-text {
      font-size: 18px;
      font-weight: 700;
      color: #2563EB;
      letter-spacing: -0.5px;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
      max-width: 380px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 0 12px 0 10px;
      gap: 8px;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }

    .search-wrapper:focus-within {
      border-color: #2563EB;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }

    .search-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #9CA3AF;
      pointer-events: none;
      line-height: 0;
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 8px 0;
      font-size: 14px;
      color: #374151;
      outline: none;
      min-width: 0;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 50%;
      color: #6B7280;
      cursor: pointer;
      transition: background 0.15s;
    }
    .icon-btn:hover { background: #F3F4F6; }

    .notif-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: #EF4444;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .divider-v {
      width: 1px;
      height: 28px;
      background: #E5E7EB;
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .profile-btn:hover { background: #F9FAFB; }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563EB, #0EA5E9);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      line-height: 1.2;
    }

    .profile-role {
      font-size: 11px;
      color: #9CA3AF;
      line-height: 1.2;
    }

    @media (max-width: 640px) {
      .search-wrapper, .profile-info { display: none; }
      .brand-text { display: none; }
    }
  `]
})
export class NavbarComponent {}
