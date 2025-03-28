import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { SocketService } from './core/services/socket.service';
import { WalletService } from './core/services/wallet.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold text-gray-800">Triwizard Quiz</h1>
              </div>
            </div>
            <div class="flex items-center">
              <button
                *ngIf="!isAuthenticated"
                (click)="login()"
                class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
              <button
                *ngIf="isAuthenticated"
                (click)="logout()"
                class="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.socketService.connect();
      } else {
        this.socketService.disconnect();
      }
    });
  }

  login(): void {
    // Navigation will be handled by the router
  }

  logout(): void {
    this.authService.logout();
  }
} 