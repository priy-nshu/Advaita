import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth endpoints
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: { username: string; email: string; password: string; walletAddress?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // User endpoints
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, { headers: this.getHeaders() });
  }

  updateWalletAddress(walletAddress: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/wallet`, { walletAddress }, { headers: this.getHeaders() });
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/stats`, { headers: this.getHeaders() });
  }

  getUserAchievements(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/achievements`, { headers: this.getHeaders() });
  }

  getLeaderboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/leaderboard`);
  }
} 