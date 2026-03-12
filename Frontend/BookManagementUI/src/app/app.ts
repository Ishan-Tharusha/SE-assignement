import { Component, signal } from '@angular/core';
import { DashboardLayoutComponent } from './components/layout/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BookManagementUI');
}
