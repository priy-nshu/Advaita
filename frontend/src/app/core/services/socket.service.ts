import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private socketUrl = environment.socketUrl;

  constructor() {
    this.socket = io(this.socketUrl, {
      autoConnect: false,
      withCredentials: true
    });
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  // Game events
  joinMatchmaking(): void {
    this.socket.emit('joinMatchmaking');
  }

  leaveMatchmaking(): void {
    this.socket.emit('leaveMatchmaking');
  }

  submitAnswer(questionId: string, answer: number): void {
    this.socket.emit('submitAnswer', { questionId, answer });
  }

  // Listeners
  onMatchFound(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('matchFound', (data) => observer.next(data));
    });
  }

  onQuestionReceived(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('question', (data) => observer.next(data));
    });
  }

  onGameEnd(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('gameEnd', (data) => observer.next(data));
    });
  }

  onError(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('error', (data) => observer.next(data));
    });
  }

  // Connection status
  isConnected(): boolean {
    return this.socket.connected;
  }

  onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('connect', () => observer.next());
    });
  }

  onDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('disconnect', () => observer.next());
    });
  }
} 