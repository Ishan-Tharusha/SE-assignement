import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ToastService } from '../../services/toast.service';
import { Book } from '../../models/book.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="page-wrapper">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ isEditMode ? 'Edit Record' : 'Add New Record' }}</h2>
          <p class="page-subtitle">
            {{ isEditMode ? 'Update the details for this book.' : 'Enter details to add a new book to the library.' }}
          </p>
        </div>
        <a routerLink="/books" class="btn-secondary">
          <span class="btn-icon"><lucide-icon name="arrow-left" style="width:15px;height:15px;display:block;"></lucide-icon></span>
          Back to Records
        </a>
      </div>



      <!-- Form Card -->
      <div class="form-card">

        <!-- Loading overlay -->
        @if (isLoading) {
          <div class="loading-overlay">
            <span class="btn-icon spin"><lucide-icon name="loader-2" style="width:28px;height:28px;display:block;color:#2563EB;"></lucide-icon></span>
            <p>Loading details...</p>
          </div>
        }

        <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">

          <!-- Section: General Info -->
          <div class="form-section">
            <h3 class="section-title">General Information</h3>
            <div class="form-grid">

              <div class="form-group">
                <label for="title" class="form-label">Book Title <span class="required">*</span></label>
                <input type="text" id="title" formControlName="title"
                       class="form-input"
                       [class.form-input-error]="bookForm.get('title')?.invalid && bookForm.get('title')?.touched"
                       placeholder="e.g. The Great Gatsby">
                @if (bookForm.get('title')?.invalid && bookForm.get('title')?.touched) {
                  <p class="field-error">
                    <span class="btn-icon"><lucide-icon name="info" style="width:12px;height:12px;display:block;"></lucide-icon></span>
                    Title is required (max 200 chars).
                  </p>
                }
              </div>

              <div class="form-group">
                <label for="author" class="form-label">Author Name <span class="required">*</span></label>
                <input type="text" id="author" formControlName="author"
                       class="form-input"
                       [class.form-input-error]="bookForm.get('author')?.invalid && bookForm.get('author')?.touched"
                       placeholder="e.g. F. Scott Fitzgerald">
                @if (bookForm.get('author')?.invalid && bookForm.get('author')?.touched) {
                  <p class="field-error">
                    <span class="btn-icon"><lucide-icon name="info" style="width:12px;height:12px;display:block;"></lucide-icon></span>
                    Author is required (max 100 chars).
                  </p>
                }
              </div>

            </div>
          </div>

          <!-- Section: Publication Details -->
          <div class="form-section" style="margin-top:28px;">
            <h3 class="section-title">Publication Details</h3>
            <div class="form-grid">

              <div class="form-group">
                <label for="isbn" class="form-label">ISBN Number <span class="required">*</span></label>
                <input type="text" id="isbn" formControlName="isbn"
                       class="form-input font-mono"
                       [class.form-input-error]="bookForm.get('isbn')?.invalid && bookForm.get('isbn')?.touched"
                       placeholder="978-3-16-148410-0">
                @if (bookForm.get('isbn')?.invalid && bookForm.get('isbn')?.touched) {
                  <p class="field-error">
                    <span class="btn-icon"><lucide-icon name="info" style="width:12px;height:12px;display:block;"></lucide-icon></span>
                    @if (bookForm.get('isbn')?.errors?.['required']) {
                      ISBN is required.
                    } @else if (bookForm.get('isbn')?.errors?.['pattern']) {
                      Invalid ISBN format (ISBN-10 or ISBN-13 required).
                    }
                  </p>
                }
              </div>

              <div class="form-group">
                <label for="publicationDate" class="form-label">Publication Date <span class="required">*</span></label>
                <input type="date" id="publicationDate" formControlName="publicationDate"
                       class="form-input"
                       [class.form-input-error]="bookForm.get('publicationDate')?.invalid && bookForm.get('publicationDate')?.touched">
                @if (bookForm.get('publicationDate')?.invalid && bookForm.get('publicationDate')?.touched) {
                  <p class="field-error">
                    <span class="btn-icon"><lucide-icon name="info" style="width:12px;height:12px;display:block;"></lucide-icon></span>
                    Publication Date is required.
                  </p>
                }
              </div>

              <div class="form-group">
                <label for="category" class="form-label">Category</label>
                <select id="category" formControlName="category" class="form-input form-select">
                  <option value="">— Select a category —</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Romance">Romance</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <a routerLink="/books" class="btn-secondary">Cancel</a>
            <button type="submit" class="btn-primary" [disabled]="bookForm.invalid || isSubmitting">
              @if (isSubmitting) {
                <span class="btn-icon spin"><lucide-icon name="loader-2" style="width:16px;height:16px;display:block;"></lucide-icon></span>
                Saving...
              } @else {
                <span class="btn-icon"><lucide-icon name="save" style="width:16px;height:16px;display:block;"></lucide-icon></span>
                {{ isEditMode ? 'Update Record' : 'Save Record' }}
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page-wrapper { display: flex; flex-direction: column; gap: 24px; max-width: 860px; }

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
      gap: 7px;
      background: #2563EB;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
      min-width: 130px;
    }
    .btn-primary:hover:not(:disabled) { background: #1D4ED8; }
    .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      background: #fff;
      color: #374151;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .btn-secondary:hover { background: #F9FAFB; }

    /* Icon wrapper for perfect alignment */
    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      flex-shrink: 0;
    }

    /* Alert */
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

    /* Card */
    .form-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      padding: 28px;
      position: relative;
      overflow: hidden;
    }

    /* Loading overlay */
    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(4px);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #6B7280;
      font-size: 14px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .spin { animation: spin 1s linear infinite; }

    /* Form sections */
    .form-section {}

    .section-title {
      margin: 0 0 16px;
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      padding-bottom: 10px;
      border-bottom: 1px solid #F3F4F6;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: #4B5563;
    }

    .required { color: #EF4444; }

    .form-input {
      display: block;
      width: 100%;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      color: #111827;
      background: #fff;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
      line-height: 1.4;
    }

    .form-input:focus {
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }

    .form-input::placeholder { color: #9CA3AF; }

    .form-input-error {
      border-color: #F87171 !important;
    }
    .form-input-error:focus {
      box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
    }

    .font-mono { font-family: monospace; font-size: 13px; }

    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
      cursor: pointer;
    }

    .field-error {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;
      font-size: 12px;
      color: #EF4444;
    }

    /* Form actions */
    .form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #F3F4F6;
    }
  `]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  bookId: string | null = null;

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    const isbnRegex = /^(?:ISBN(?:-10)?:?\s?)?(?:(?:\d-?){9}[\dX]|(?:\d-?){13})$/i;
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      isbn: ['', [Validators.required, Validators.pattern(isbnRegex)]],
      publicationDate: ['', Validators.required],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.bookService.getBook(this.bookId).subscribe({
        next: (book) => {
          const date = new Date(book.publicationDate);
          const formattedDate = date.toISOString().split('T')[0];
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationDate: formattedDate,
            category: book.category ?? ''
          });
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching book:', err);
          this.errorMessage = 'Failed to load book details.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.bookForm.value as Book;

    if (this.isEditMode && this.bookId) {
      const bookToUpdate = { ...formValue, id: this.bookId } as Book;
      this.bookService.updateBook(this.bookId, bookToUpdate).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('Record updated successfully');
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Error updating book:', err);
          if (err.status === 409) {
            this.toastService.error('ISBN already exists');
          } else {
            this.toastService.error('Failed to update record');
          }
          this.isSubmitting = false;
        }
      });
    } else {
      this.bookService.addBook(formValue).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastService.success('New record added successfully');
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Error adding book:', err);
          if (err.status === 409) {
            this.toastService.error('ISBN already exists');
          } else {
            this.toastService.error('Failed to save record');
          }
          this.isSubmitting = false;
        }
      });
    }
  }
}
