import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'K46-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'K46-frontend';
  constructor(public authService: AuthService) {}
}
