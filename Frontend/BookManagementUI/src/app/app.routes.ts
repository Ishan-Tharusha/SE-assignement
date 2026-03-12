import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list';
import { BookFormComponent } from './pages/book-form/book-form';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/add', component: BookFormComponent },
  { path: 'books/edit/:id', component: BookFormComponent }
];

