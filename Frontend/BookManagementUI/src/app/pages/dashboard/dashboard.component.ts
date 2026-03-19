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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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

