import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private apiUrl = 'http://localhost:3000/charts'; // Base URL for chart data

  constructor(private http: HttpClient) {}

  // Fetch data for the Summary chart
  getSumChartData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sum-chart`);
  }

  // Fetch data for the Reports chart
  getRepChartData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rep-chart`);
  }
}
