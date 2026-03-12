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
  template: `
    <div class="page-wrapper">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Manage Records</h2>
          <p class="page-subtitle">View, search, and manage all books in the library.</p>
        </div>
        <button routerLink="/books/add" class="btn-primary">
          <span class="btn-icon"><lucide-icon name="plus" style="width:16px;height:16px;display:block;"></lucide-icon></span>
          Add New Record
        </button>
      </div>



      <!-- Table Card -->
      <div class="table-card">

      <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="search-wrapper">
              <span class="search-icon-wrap"><lucide-icon name="search" style="width:15px;height:15px;display:block;"></lucide-icon></span>
              <input type="text" placeholder="Search by title, author or ISBN..."
                     class="search-input" [(ngModel)]="searchTerm" (input)="applyFilters()" />
            </div>
            
            <div class="filter-wrapper">
              <select class="filter-select" [(ngModel)]="selectedCategory" (change)="applyFilters()">
                <option value="">All Categories</option>
                @for (cat of categories; track cat) {
                  <option [value]="cat">{{ cat }}</option>
                }
              </select>
            </div>
          </div>

          <div class="toolbar-right">
            <span class="record-count">Showing {{ filteredBooks.length }} records</span>
          </div>
        </div>

        <!-- Loading -->
        @if (isLoading) {
          <div class="loading-state">
            <lucide-icon name="loader-2" class="spin" style="width:28px;height:28px;color:#2563EB;"></lucide-icon>
            <p>Loading records...</p>
          </div>
        }

        <!-- Table -->
        @if (!isLoading && pagedBooks.length > 0) {
          <div class="table-outer">
            <table class="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Published Date</th>
                  <th>Category</th>
                  <th class="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (book of pagedBooks; track book.id) {
                  <tr class="table-row">
                    <td class="td-title">
                      <span class="book-title">{{ book.title }}</span>
                      <span class="book-author-mobile">{{ book.author }}</span>
                    </td>
                    <td class="td-author">{{ book.author }}</td>
                    <td class="td-isbn">{{ book.isbn }}</td>
                    <td class="td-date">{{ book.publicationDate | date:'mediumDate' }}</td>
                    <td class="td-category">
                      @if (book.category) {
                        <span class="category-tag">{{ book.category }}</span>
                      } @else {
                        <span class="no-category">—</span>
                      }
                    </td>

                    <td class="td-actions">
                      <div class="action-buttons">
                        <a [routerLink]="['/books/edit', book.id]" class="action-btn action-edit" title="Edit">
                          <lucide-icon name="pencil" style="width:15px;height:15px;"></lucide-icon>
                        </a>
                        <button (click)="requestDelete(book.id)" class="action-btn action-delete" title="Delete">
                          <lucide-icon name="trash-2" style="width:15px;height:15px;"></lucide-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar">
            <div class="pagination-info">
              <span class="page-text">Page {{ currentPage }} of {{ totalPages }}</span>
              <div class="size-selector">
                <span class="size-label">Show</span>
                <select class="size-select" [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                  @for (size of pageSizes; track size) {
                    <option [value]="size">{{ size }}</option>
                  }
                </select>
                <span class="size-label">per page</span>
              </div>
            </div>
            <div class="pagination-btns">
              <button class="page-btn" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)">Previous</button>
              <button class="page-btn" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)">Next</button>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading && pagedBooks.length === 0 && !errorMessage) {
          <div class="empty-state">
            <div class="empty-icon-wrap">
              <lucide-icon name="database" style="width:32px;height:32px;color:#9CA3AF;"></lucide-icon>
            </div>
            <h3 class="empty-title">No records found</h3>
            <p class="empty-desc">
              Get started by adding a new book, or adjust your search filters.
            </p>
            <button routerLink="/books/add" class="btn-primary" style="margin-top:20px;">
              <lucide-icon name="plus" style="width:15px;height:15px;"></lucide-icon>
              Add Record
            </button>
          </div>
        }

      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <app-modal
      [isOpen]="!!pendingDeleteId"
      title="Delete Record"
      confirmText="Delete"
      confirmClass="btn-danger"
      [isLoading]="isDeleting"
      (close)="cancelDelete()"
      (confirm)="confirmDelete()">
      <div class="modal-delete-content">
        <div class="warning-sign warning-sign-red">
          <lucide-icon name="alert-circle" style="width:32px;height:32px;color:#EF4444;"></lucide-icon>
        </div>
        
        <div class="confirm-message">
          <p>This action <strong>cannot</strong> be undone.</p>
          <p class="confirm-prompt">
            Please type <strong>{{ getPendingBookTitle() }}</strong> to confirm.
          </p>
        </div>

        <div class="input-wrapper">
          <input 
            type="text" 
            [(ngModel)]="confirmationValue" 
            placeholder="Type book title here..."
            class="confirm-input"
            [class.input-error]="showConfirmationError"
            (keyup.enter)="confirmDelete()"
            (input)="showConfirmationError = false"
          />
          @if (showConfirmationError) {
            <p class="validation-warning">
              <lucide-icon name="alert-circle" style="width:14px;height:14px;"></lucide-icon>
              Please enter the correct book title to delete.
            </p>
          }
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    :host { display: block; }

    /* Page layout */
    .page-wrapper { display: flex; flex-direction: column; gap: 24px; }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .page-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.4px;
    }

    .page-subtitle {
      margin: 4px 0 0;
      font-size: 14px;
      color: #6B7280;
    }

    /* Buttons */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #2563EB;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 9px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-primary:hover { background: #1D4ED8; }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      flex-shrink: 0;
    }

    /* Alerts */
    .alert-error {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #FEF2F2;
      border-left: 4px solid #EF4444;
      color: #991B1B;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
    }

    /* Table Card */
    .table-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    /* Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 18px;
      border-bottom: 1px solid #F3F4F6;
      background: #FAFAFA;
      flex-wrap: wrap;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 320px;
      min-width: 200px;
      background: #fff;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 0 12px 0 10px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .search-wrapper:focus-within {
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
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
      padding: 9px 0;
      font-size: 13px;
      color: #374151;
      outline: none;
      min-width: 0;
    }

    .filter-wrapper {
      min-width: 140px;
    }

    .filter-select {
      width: 100%;
      padding: 8.5px 12px;
      font-size: 13px;
      color: #374151;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: #fff;
      outline: none;
      cursor: pointer;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .record-count {
      font-size: 13px;
      color: #6B7280;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 56px 24px;
      gap: 12px;
      color: #9CA3AF;
      font-size: 14px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin { animation: spin 1s linear infinite; }

    /* Table */
    .table-outer { overflow-x: auto; }

    .books-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .books-table thead tr {
      background: #F9FAFB;
      border-bottom: 1px solid #E5E7EB;
    }

    .books-table th {
      padding: 10px 18px;
      font-size: 11px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      text-align: left;
      white-space: nowrap;
    }

    .books-table th.th-right { text-align: right; min-width: 100px; }

    .books-table td {
      padding: 13px 18px;
      vertical-align: middle;
      border-bottom: 1px solid #F3F4F6;
      color: #374151;
    }

    .table-row:last-child td { border-bottom: none; }
    .table-row:hover { background: #FAFAFA; }

    .td-title { font-weight: 500; color: #111827; }

    .book-title { display: block; }

    .book-author-mobile {
      display: none;
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .td-author, .td-isbn { display: none; }
      .book-author-mobile { display: block; }
    }

    .td-isbn {
      font-family: monospace;
      font-size: 12px;
      color: #6B7280;
    }

    .td-date { color: #6B7280; white-space: nowrap; }

    .td-category { white-space: nowrap; }

    .category-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
      background: #EEF2FF;
      color: #4F46E5;
    }

    .no-category {
      color: #D1D5DB;
      font-size: 14px;
    }

    /* Actions */
    .td-actions { text-align: right; min-width: 100px; }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }

    /* Pagination */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-top: 1px solid #F3F4F6;
      background: #FAFAFA;
      font-size: 13px;
      color: #6B7280;
      flex-wrap: wrap;
      gap: 12px;
    }

    .pagination-info {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .size-selector {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .size-select {
        padding: 4px 8px;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 12px;
        background: #fff;
        outline: none;
        cursor: pointer;
    }

    .pagination-btns { display: flex; gap: 6px; }

    .page-btn {
      padding: 5px 14px;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      background: #fff;
      font-size: 13px;
      color: #374151;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .page-btn:hover { background: #F3F4F6; }
    .page-btn:disabled { color: #9CA3AF; cursor: not-allowed; background: #F9FAFB; }

    .modal-delete-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 20px;
    }

    .warning-sign-red {
      width: 64px;
      height: 64px;
      background: #FEF2F2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid #FEE2E2;
      color: #EF4444;
    }

    .confirm-message p { margin: 4px 0; }
    .confirm-prompt { font-size: 13px; color: #6B7280; }

    .input-wrapper { width: 100%; text-align: left; }

    .confirm-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    .confirm-input:focus {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-error {
      border-color: #EF4444 !important;
      background: #FFF5F5;
    }

    .validation-warning {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #DC2626;
      font-size: 12px;
      font-weight: 500;
      margin-top: 8px;
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background: transparent;
      text-decoration: none;
      transition: background 0.15s;
    }
    .action-edit   { color: #2563EB; }
    .action-edit:hover   { background: #EFF6FF; }
    .action-delete { color: #EF4444; }
    .action-delete:hover { background: #FEF2F2; }
  `]
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
    return this.books.find(b => b.id === this.pendingDeleteId)?.title || '';
  }

  confirmDelete(): void {
    if (!this.pendingDeleteId) return;
    
    // Validation check
    if (this.confirmationValue !== this.getPendingBookTitle()) {
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
