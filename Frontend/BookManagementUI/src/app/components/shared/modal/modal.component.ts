import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: 'lucide-icons', useValue: { X, AlertTriangle } }
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() confirmClass = 'btn-primary';
  @Input() isLoading = false;
  @Input() confirmDisabled = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    if (!this.isLoading) {
      this.close.emit();
    }
  }

  onConfirm() {
    this.confirm.emit();
  }
}
