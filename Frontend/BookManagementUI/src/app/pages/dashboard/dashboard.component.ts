import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { LucideAngularModule } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { ChartConfiguration, ChartOptions } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Dashboard Overview</h2>
          <p class="text-[var(--text-secondary)] mt-1">Here's a summary of your library statistics.</p>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">

        <div class="kpi-card" style="border-left:3px solid #2563EB;">
          <div class="kpi-header">
            <span class="kpi-label">Total Books</span>
            <span class="kpi-icon kpi-icon-blue"><lucide-icon name="book" style="width:14px;height:14px;display:block;"></lucide-icon></span>
          </div>
          <div class="kpi-value">{{ totalBooks }}</div>
          <p class="kpi-trend">Total entries in library</p>
        </div>

        <div class="kpi-card" style="border-left:3px solid #22C55E;">
          <div class="kpi-header">
            <span class="kpi-label">Unique Authors</span>
            <span class="kpi-icon kpi-icon-green"><lucide-icon name="activity" style="width:14px;height:14px;display:block;"></lucide-icon></span>
          </div>
          <div class="kpi-value">{{ uniqueAuthors }}</div>
          <p class="kpi-trend">Diverse contributors</p>
        </div>

        <div class="kpi-card" style="border-left:3px solid #0EA5E9;">
          <div class="kpi-header">
             <span class="kpi-label">Categories</span>
            <span class="kpi-icon kpi-icon-sky"><lucide-icon name="book-open" style="width:14px;height:14px;display:block;"></lucide-icon></span>
          </div>
          <div class="kpi-value">{{ uniqueCategories }}</div>
          <p class="kpi-trend">Active genres</p>
        </div>

        <div class="kpi-card" style="border-left:3px solid #F59E0B;">
          <div class="kpi-header">
            <span class="kpi-label">Latest Pub</span>
            <span class="kpi-icon kpi-icon-amber"><lucide-icon name="clock" style="width:14px;height:14px;display:block;"></lucide-icon></span>
          </div>
          <div class="kpi-value">{{ latestPubYear }}</div>
          <p class="kpi-trend">Newest release year</p>
        </div>

      </div>

      <!-- Charts Area -->
      <div class="max-w-4xl mx-auto w-full">
        <div class="dashboard-card h-96 flex flex-col">
          <h3 class="font-semibold text-[var(--text-primary)] mb-4">Genre Distribution</h3>
          <div class="flex-1 relative flex items-center justify-center pb-4">
             <canvas baseChart
              [data]="pieChartData"
              [options]="pieChartOptions"
              [type]="'doughnut'">
            </canvas>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    @media (max-width: 1024px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px)  { .kpi-grid { grid-template-columns: 1fr; } }

    .kpi-card {
      background: #fff;
      border-radius: 10px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      padding: 14px 16px;
      transition: box-shadow 0.2s;
    }
    .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .kpi-label {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .kpi-icon-blue  { background: #EFF6FF; color: #2563EB; }
    .kpi-icon-green { background: #F0FDF4; color: #22C55E; }
    .kpi-icon-sky   { background: #F0F9FF; color: #0EA5E9; }
    .kpi-icon-amber { background: #FFFBEB; color: #F59E0B; }

    .kpi-value {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      line-height: 1;
      margin-bottom: 6px;
    }

    .kpi-trend {
      margin: 0;
      font-size: 11px;
      color: #9CA3AF;
    }

    .trend-up   { color: #22C55E; font-weight: 600; }
    .trend-down { color: #EF4444; font-weight: 600; }
  `]
})
export class DashboardComponent implements OnInit {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);
  
  totalBooks = 0;
  uniqueAuthors = 0;
  uniqueCategories = 0;
  latestPubYear: string | number = '—';



  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#2563EB', '#0EA5E9', '#22C55E', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6']
    }]
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  ngOnInit() {
    console.log('DashboardComponent initialized, fetching books...');
    this.bookService.getBooks().subscribe({
      next: (books) => {
        console.log('Successfully fetched books:', books.length);
        this.totalBooks = books.length;
        if (books.length === 0) {
          this.cdr.detectChanges();
          return;
        }

        // KPI: Unique Authors
        const authors = new Set(books.map(b => b.author.trim().toLowerCase()));
        this.uniqueAuthors = authors.size;

        // KPI: Unique Categories
        const categories = new Set(books.filter(b => b.category).map(b => b.category!));
        this.uniqueCategories = categories.size;

        // KPI: Latest Publication Year
        const years = books.map(b => new Date(b.publicationDate).getFullYear());
        this.latestPubYear = Math.max(...years);

        // Chart: Category Distribution
        const catCounts: Record<string, number> = {};
        books.forEach(b => {
          const cat = b.category || 'Uncategorized';
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        
        this.pieChartData = {
          labels: Object.keys(catCounts),
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: Object.values(catCounts)
          }]
        };



        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }
}

