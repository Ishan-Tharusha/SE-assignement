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
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toastService = inject(ToastService);
}
