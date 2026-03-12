import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {
  LucideAngularModule,
  LayoutDashboard,
  Database,
  PlusCircle,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  Book,
  BookOpen,
  Clock,
  Activity,
  Plus,
  Filter,
  Loader2,
  ArrowUpDown,
  Pencil,
  Trash2,
  Home,
  AlertCircle,
  Info,
  ArrowLeft,
  Save
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Database,
        PlusCircle,
        PieChart,
        Settings,
        ChevronLeft,
        ChevronRight,
        Bell,
        Search,
        User,
        Book,
        BookOpen,
        Clock,
        Activity,
        Plus,
        Filter,
        Loader2,
        ArrowUpDown,
        Pencil,
        Trash2,
        Home,
        AlertCircle,
        Info,
        ArrowLeft,
        Save
      })
    ),
  ]
};
