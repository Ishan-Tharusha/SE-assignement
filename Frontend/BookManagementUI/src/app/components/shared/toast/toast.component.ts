import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { LucideAngularModule, CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: 'lucide-icons', useValue: { CheckCircle, XCircle, AlertCircle, Info, X } }
  ],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div class="toast" [class]="toast.type" role="alert">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <lucide-icon name="check-circle"></lucide-icon> }
              @case ('error')   { <lucide-icon name="x-circle"></lucide-icon> }
              @case ('warning') { <lucide-icon name="alert-circle"></lucide-icon> }
              @default          { <lucide-icon name="info"></lucide-icon> }
            }
          </div>
          <div class="toast-content">
            {{ toast.message }}
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <lucide-icon name="x" style="width:14px;height:14px;"></lucide-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      max-width: 450px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      animation: toast-in 0.3s cubic-bezier(0, 0, 0.2, 1);
      position: relative;
    }

    @keyframes toast-in {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    .toast-icon {
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success .toast-icon { color: #22C55E; }
    .error .toast-icon   { color: #EF4444; }
    .warning .toast-icon { color: #F59E0B; }
    .info .toast-icon    { color: #3B82F6; }

    .toast-content {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: #1F2937;
    }

    .toast-close {
      margin-left: 12px;
      background: transparent;
      border: none;
      color: #9CA3AF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 6px;
      transition: background 0.2s, color 0.2s;
    }

    .toast-close:hover {
      background: #F3F4F6;
      color: #1F2937;
    }

    /* Type specific borders or accents */
    .success { border-left: 4px solid #22C55E; }
    .error   { border-left: 4px solid #EF4444; }
    .warning { border-left: 4px solid #F59E0B; }
    .info    { border-left: 4px solid #3B82F6; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
