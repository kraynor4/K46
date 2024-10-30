import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;
  apiUrl: string = 'http://your-api-url.com'; // Define your API URL here
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
  

login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
    tap((response: any) => {
      if (response && response.token) {
        localStorage.setItem('token', response.token); // Store JWT token in localStorage
       }
    })
  );
}

onLogin(): void {
  this.authService.login(this.username, this.password).subscribe(
    () => {
      // Navigate directly to the dashboard on successful login
      this.router.navigate(['/dashboard']);
    },
    (error) => {
      console.error('Login failed', error);
      // Show error message if login fails
      this.loginError = true;
    }
  );
}}
