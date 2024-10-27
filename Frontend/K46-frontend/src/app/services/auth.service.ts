import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Replace with your backend URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }
//Create Login Method
login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
    tap(response => {
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }
    }),
    catchError(this.handleError<any>('login'))
  );
}

//Token Management Methods
isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  return token != null && !this.jwtHelper.isTokenExpired(token);
}

getToken(): string | null {
  return localStorage.getItem('token');
}

logout(): void {
  localStorage.removeItem('token');
}

// Error Handling Helper Method
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}
}
