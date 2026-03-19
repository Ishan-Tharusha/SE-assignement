import { Component } from '@angular/core';
import { LucideAngularModule, Bell, Search, User } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {}
