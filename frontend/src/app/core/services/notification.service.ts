import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  info(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }

  // Game-specific notifications
  matchFound(opponent: string): void {
    this.info(`Match found! Your opponent is ${opponent}`);
  }

  gameStarting(): void {
    this.info('Game is starting...');
  }

  questionReceived(): void {
    this.info('New question received!');
  }

  answerSubmitted(): void {
    this.success('Answer submitted successfully!');
  }

  gameEnded(winner: boolean): void {
    if (winner) {
      this.success('Congratulations! You won the game!');
    } else {
      this.info('Game ended. Better luck next time!');
    }
  }

  // Wallet notifications
  walletConnected(address: string): void {
    this.success(`Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
  }

  walletDisconnected(): void {
    this.warning('Wallet disconnected');
  }

  nftMinted(tokenId: string): void {
    this.success(`NFT minted successfully! Token ID: ${tokenId}`);
  }

  // Error notifications
  connectionError(): void {
    this.error('Connection error. Please check your internet connection.');
  }

  walletError(message: string): void {
    this.error(`Wallet error: ${message}`);
  }

  gameError(message: string): void {
    this.error(`Game error: ${message}`);
  }
} 