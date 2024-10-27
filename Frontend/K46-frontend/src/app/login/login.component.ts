import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'K46-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        // Navigate to the dashboard on successful login
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed', error);
        // Show error message if login fails
        this.loginError = true;
      }
    );
  }
}

