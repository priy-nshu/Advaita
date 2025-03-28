import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  category: string;
  timeLimit: number;
}

interface DifficultyConfig {
  baseTimeLimit: number;
  minTimeLimit: number;
  maxTimeLimit: number;
  difficultyRange: number;
  adjustmentFactor: number;
}

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  private readonly config: DifficultyConfig = {
    baseTimeLimit: 30,
    minTimeLimit: 15,
    maxTimeLimit: 45,
    difficultyRange: 5,
    adjustmentFactor: 0.1
  };

  private currentDifficulty = new BehaviorSubject<number>(1);
  private playerPerformance = new BehaviorSubject<number>(0.5); // 0.5 is neutral performance
  private questionHistory: Question[] = [];

  constructor() {}

  adjustDifficulty(playerAnswer: number, correctAnswer: number, timeTaken: number): void {
    const isCorrect = playerAnswer === correctAnswer;
    const timePerformance = this.calculateTimePerformance(timeTaken);
    
    // Update player performance score
    const newPerformance = this.playerPerformance.value + 
      (isCorrect ? this.config.adjustmentFactor : -this.config.adjustmentFactor) +
      (timePerformance * this.config.adjustmentFactor);
    
    this.playerPerformance.next(Math.max(0, Math.min(1, newPerformance)));

    // Adjust difficulty based on performance
    const difficultyChange = (this.playerPerformance.value - 0.5) * this.config.adjustmentFactor;
    const newDifficulty = Math.max(1, Math.min(this.config.difficultyRange, 
      this.currentDifficulty.value + difficultyChange));
    
    this.currentDifficulty.next(newDifficulty);
  }

  private calculateTimePerformance(timeTaken: number): number {
    const timeLimit = this.getCurrentTimeLimit();
    const timeRatio = timeTaken / timeLimit;
    return 1 - timeRatio; // Higher performance for faster answers
  }

  getCurrentTimeLimit(): number {
    const difficulty = this.currentDifficulty.value;
    const baseTime = this.config.baseTimeLimit;
    const adjustment = (difficulty - 1) * 2; // Increase time limit with difficulty
    
    return Math.min(
      this.config.maxTimeLimit,
      Math.max(this.config.minTimeLimit, baseTime + adjustment)
    );
  }

  getCurrentDifficulty(): number {
    return this.currentDifficulty.value;
  }

  getPlayerPerformance(): number {
    return this.playerPerformance.value;
  }

  addQuestionToHistory(question: Question): void {
    this.questionHistory.push(question);
    if (this.questionHistory.length > 10) {
      this.questionHistory.shift();
    }
  }

  getQuestionHistory(): Question[] {
    return [...this.questionHistory];
  }

  resetDifficulty(): void {
    this.currentDifficulty.next(1);
    this.playerPerformance.next(0.5);
    this.questionHistory = [];
  }
} 