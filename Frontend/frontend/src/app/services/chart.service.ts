import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private apiUrl = `${environment.apiUrl}/charts`; // Use environment apiUrl and append /charts

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
