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
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.css']
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
