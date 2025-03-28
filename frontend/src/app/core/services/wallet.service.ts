import { Injectable } from '@angular/core';
import { Web3 } from 'web3';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private web3: Web3;
  private accountSubject = new BehaviorSubject<string | null>(null);
  public account$ = this.accountSubject.asObservable();

  constructor(private authService: AuthService) {
    this.web3 = new Web3(window.ethereum);
  }

  async connectWallet(): Promise<void> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.accountSubject.next(accounts[0]);
      await this.updateUserWalletAddress(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.accountSubject.next(null);
  }

  private async updateUserWalletAddress(address: string): Promise<void> {
    try {
      await this.authService.updateWalletAddress(address).toPromise();
    } catch (error) {
      console.error('Error updating wallet address:', error);
      throw error;
    }
  }

  async checkNFTBalance(): Promise<number> {
    try {
      const contract = new this.web3.eth.Contract(
        JSON.parse(environment.nftContractAbi),
        environment.nftContractAddress
      );

      const balance = await contract.methods.balanceOf(this.accountSubject.value).call();
      return parseInt(balance);
    } catch (error) {
      console.error('Error checking NFT balance:', error);
      throw error;
    }
  }

  async mintNFT(): Promise<string> {
    try {
      const contract = new this.web3.eth.Contract(
        JSON.parse(environment.nftContractAbi),
        environment.nftContractAddress
      );

      const transaction = await contract.methods.mint().send({
        from: this.accountSubject.value
      });

      return transaction.transactionHash;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  isWalletConnected(): boolean {
    return !!this.accountSubject.value;
  }

  getCurrentAccount(): string | null {
    return this.accountSubject.value;
  }
} 