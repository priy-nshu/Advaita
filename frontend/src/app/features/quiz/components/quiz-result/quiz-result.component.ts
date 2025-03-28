import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../../../core/services/wallet.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-result',
  template: `
    <div class="quiz-container">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4">
            {{ isWinner ? 'Victory!' : 'Better Luck Next Time!' }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ isWinner ? 'You have proven yourself worthy!' : 'Keep practicing your magical knowledge!' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Your Score</h3>
            <p class="text-2xl font-bold text-blue-600">{{ playerScore }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Opponent's Score</h3>
            <p class="text-2xl font-bold text-red-600">{{ opponentScore }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <button
            (click)="playAgain()"
            class="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Play Again
          </button>

          <button
            *ngIf="isWinner && canMintNFT"
            (click)="mintNFT()"
            class="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Mint Achievement NFT
          </button>

          <button
            (click)="goToLeaderboard()"
            class="w-full py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuizResultComponent implements OnInit {
  isWinner = false;
  playerScore = 0;
  opponentScore = 0;
  canMintNFT = false;

  constructor(
    private router: Router,
    private walletService: WalletService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // In a real app, these values would come from a service or route data
    this.isWinner = true; // Example value
    this.playerScore = 850; // Example value
    this.opponentScore = 750; // Example value
    this.checkNFTEligibility();
  }

  private async checkNFTEligibility(): Promise<void> {
    try {
      const balance = await this.walletService.checkNFTBalance();
      this.canMintNFT = balance === 0;
    } catch (error) {
      console.error('Error checking NFT balance:', error);
    }
  }

  playAgain(): void {
    this.router.navigate(['/quiz']);
  }

  async mintNFT(): Promise<void> {
    try {
      const txHash = await this.walletService.mintNFT();
      this.notificationService.nftMinted(txHash);
    } catch (error) {
      this.notificationService.walletError('Failed to mint NFT');
    }
  }

  goToLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }
} 