import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../../../core/services/socket.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-lobby',
  template: `
    <div class="quiz-container">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">Welcome to the Triwizard Quiz</h2>
        <p class="text-gray-600 mb-6">
          Test your knowledge of the wizarding world against other players!
        </p>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Your Stats</h3>
              <p class="text-gray-600">Games Played: {{ stats.gamesPlayed }}</p>
              <p class="text-gray-600">Win Rate: {{ (stats.gamesWon / stats.gamesPlayed * 100).toFixed(1) }}%</p>
            </div>
            <div class="text-right">
              <h3 class="text-lg font-semibold">ELO Rating</h3>
              <p class="text-2xl font-bold text-blue-600">{{ stats.eloRating }}</p>
            </div>
          </div>

          <div class="mt-6">
            <button
              (click)="startMatchmaking()"
              [disabled]="isSearching"
              class="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {{ isSearching ? 'Searching for opponent...' : 'Start Matchmaking' }}
            </button>
          </div>

          <div *ngIf="isSearching" class="text-center mt-4">
            <div class="loading-spinner mx-auto"></div>
            <p class="text-gray-600 mt-2">Looking for a worthy opponent...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuizLobbyComponent implements OnInit, OnDestroy {
  isSearching = false;
  stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    eloRating: 1000
  };

  constructor(
    private router: Router,
    private socketService: SocketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.socketService.onMatchFound().subscribe(match => {
      this.isSearching = false;
      this.notificationService.matchFound(match.opponent);
      this.router.navigate(['/quiz/room']);
    });
  }

  ngOnDestroy(): void {
    if (this.isSearching) {
      this.socketService.leaveMatchmaking();
    }
  }

  startMatchmaking(): void {
    this.isSearching = true;
    this.socketService.joinMatchmaking();
  }
} 