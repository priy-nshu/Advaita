import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUser(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.login({ email, password });
  }

  register(username: string, email: string, password: string, walletAddress?: string): Observable<any> {
    return this.apiService.register({ username, email, password, walletAddress });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!localStorage.getItem('token');
  }

  updateUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateWalletAddress(walletAddress: string): Observable<any> {
    return this.apiService.updateWalletAddress(walletAddress);
  }
} 