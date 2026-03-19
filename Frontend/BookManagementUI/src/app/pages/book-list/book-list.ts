import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ToastService } from '../../services/toast.service';
import { Book } from '../../models/book.model';
import { LucideAngularModule } from 'lucide-angular';
import { ModalComponent } from '../../components/shared/modal/modal.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ModalComponent, FormsModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  pagedBooks: Book[] = [];
  
  // Filtering
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  // Pagination
  pageSize = 5;
  currentPage = 1;
  pageSizes = [5, 10, 15, 25];

  isLoading = false;
  isDeleting = false;
  errorMessage = '';
  pendingDeleteId: string | null = null;
  confirmationValue = '';
  showConfirmationError = false;

  bookService = inject(BookService);
  toastService = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.extractCategories();
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.errorMessage = 'Failed to load books. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  extractCategories(): void {
    const cats = new Set<string>();
    this.books.forEach(b => {
      if (b.category) cats.add(b.category);
    });
    this.categories = Array.from(cats).sort();
  }

  applyFilters(): void {
    let result = [...this.books];

    // Search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.includes(term)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      result = result.filter(b => b.category === this.selectedCategory);
    }

    this.filteredBooks = result;
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePagedBooks();
  }

  updatePagedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + Number(this.pageSize);
    this.pagedBooks = this.filteredBooks.slice(startIndex, endIndex);
    this.cdr.detectChanges();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.pageSize) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedBooks();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagedBooks();
  }

  requestDelete(id: string): void {
    this.pendingDeleteId = id;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.pendingDeleteId = null;
    this.confirmationValue = '';
    this.showConfirmationError = false;
  }

  getPendingBookTitle(): string {
    return this.books.find(b => String(b.id) === String(this.pendingDeleteId))?.title || '';
  }

  confirmDelete(): void {
    if (!this.pendingDeleteId) return;
    
    // Validation check: Case-insensitive and trimmed comparison
    const expected = this.getPendingBookTitle().toLowerCase().trim();
    const actual = this.confirmationValue.toLowerCase().trim();
    
    if (actual !== expected) {
      this.showConfirmationError = true;
      return;
    }
    
    const id = this.pendingDeleteId;
    this.isDeleting = true;

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.pendingDeleteId = null;
        this.toastService.success('Record deleted successfully');
        this.loadBooks();
      },
      error: (err) => {
        console.error('Error deleting book', err);
        this.isDeleting = false;
        this.pendingDeleteId = null;
        this.toastService.error('Failed to delete record');
      }
    });
  }
}
