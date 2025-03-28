import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface PlayerStats {
  eloRating: number;
  gamesPlayed: number;
  winRate: number;
  lastMatchTime: number;
}

interface MatchmakingConfig {
  maxWaitTime: number;
  eloRange: number;
  pingThreshold: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private readonly config: MatchmakingConfig = {
    maxWaitTime: 30000, // 30 seconds
    eloRange: 200, // ±200 ELO points
    pingThreshold: 50 // 50ms
  };

  private currentStats: PlayerStats = {
    eloRating: 1000,
    gamesPlayed: 0,
    winRate: 0,
    lastMatchTime: 0
  };

  private matchmakingStatus = new BehaviorSubject<boolean>(false);
  private matchFound = new BehaviorSubject<any>(null);

  constructor(private socketService: SocketService) {
    this.initializeSocketListeners();
  }

  private initializeSocketListeners(): void {
    this.socketService.onMatchFound().subscribe(match => {
      this.matchFound.next(match);
      this.matchmakingStatus.next(false);
    });

    this.socketService.onPingResponse().subscribe(ping => {
      if (ping > this.config.pingThreshold) {
        this.leaveMatchmaking();
      }
    });
  }

  startMatchmaking(): Observable<any> {
    this.matchmakingStatus.next(true);
    this.matchFound.next(null);

    // Start periodic ping checks
    const pingInterval = setInterval(() => {
      this.socketService.checkPing();
    }, 1000);

    // Set timeout for maximum wait time
    const timeout = setTimeout(() => {
      this.leaveMatchmaking();
    }, this.config.maxWaitTime);

    return this.matchFound.asObservable();
  }

  leaveMatchmaking(): void {
    this.matchmakingStatus.next(false);
    this.socketService.leaveMatchmaking();
  }

  updatePlayerStats(stats: Partial<PlayerStats>): void {
    this.currentStats = { ...this.currentStats, ...stats };
  }

  getCurrentStats(): PlayerStats {
    return { ...this.currentStats };
  }

  calculateEloChange(winner: boolean, opponentElo: number): number {
    const K = 32; // K-factor for ELO calculation
    const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - this.currentStats.eloRating) / 400));
    const actualScore = winner ? 1 : 0;
    return Math.round(K * (actualScore - expectedScore));
  }
} 