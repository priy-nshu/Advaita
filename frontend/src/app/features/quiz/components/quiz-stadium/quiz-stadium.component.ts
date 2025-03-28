import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../../../core/services/socket.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatchmakingService } from '../../../../core/services/matchmaking.service';
import { DifficultyService } from '../../../../core/services/difficulty.service';

@Component({
  selector: 'app-quiz-stadium',
  template: `
    <div class="quiz-container">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <div class="text-center">
            <h3 class="text-lg font-semibold">Your Score</h3>
            <p class="text-2xl font-bold text-blue-600">{{ playerScore }}</p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Time</h3>
            <p class="text-2xl font-bold" [ngClass]="{'text-red-600': timeLeft < 10, 'text-gray-600': timeLeft >= 10}">
              {{ timeLeft }}s
            </p>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold">Opponent</h3>
            <p class="text-2xl font-bold text-red-600">{{ opponentScore }}</p>
          </div>
        </div>

        <div class="relative h-64 bg-gray-100 rounded-lg mb-6 overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-2">{{ currentQuestion?.question }}</h2>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div
                  *ngFor="let option of currentQuestion?.options; let i = index"
                  class="answer-option"
                  [class.selected]="selectedAnswer === i"
                  (click)="selectAnswer(i)"
                  [class.disabled]="isAnswerSubmitted"
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600">
            Question {{ currentQuestionNumber }}/{{ totalQuestions }}
            <span class="ml-2">Difficulty: {{ currentDifficulty }}</span>
          </div>
          <button
            (click)="submitAnswer()"
            [disabled]="selectedAnswer === null || isAnswerSubmitted"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isAnswerSubmitted ? 'Answer Submitted' : 'Submit Answer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .answer-option {
      @apply p-4 bg-white rounded-lg shadow cursor-pointer transition-all duration-200;
    }
    .answer-option:hover:not(.disabled) {
      @apply transform scale-105;
    }
    .answer-option.selected {
      @apply bg-blue-100 border-2 border-blue-500;
    }
    .answer-option.disabled {
      @apply cursor-not-allowed opacity-75;
    }
  `]
})
export class QuizStadiumComponent implements OnInit, OnDestroy {
  currentQuestion: any = null;
  selectedAnswer: number | null = null;
  playerScore = 0;
  opponentScore = 0;
  timeLeft = 30;
  currentQuestionNumber = 0;
  totalQuestions = 10;
  isAnswerSubmitted = false;
  currentDifficulty = 1;
  private timer: any;
  private startTime: number = 0;

  constructor(
    private socketService: SocketService,
    private notificationService: NotificationService,
    private matchmakingService: MatchmakingService,
    private difficultyService: DifficultyService
  ) {}

  ngOnInit(): void {
    this.startTimer();
    this.socketService.onQuestionReceived().subscribe(question => {
      this.currentQuestion = question;
      this.selectedAnswer = null;
      this.isAnswerSubmitted = false;
      this.timeLeft = this.difficultyService.getCurrentTimeLimit();
      this.currentDifficulty = this.difficultyService.getCurrentDifficulty();
      this.currentQuestionNumber++;
      this.startTime = Date.now();
    });

    this.socketService.onGameEnd().subscribe(result => {
      this.notificationService.gameEnded(result.winner);
    });

    this.socketService.onOpponentAnswer().subscribe(answer => {
      this.opponentScore += answer.isCorrect ? 100 : 0;
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0 && !this.isAnswerSubmitted) {
        this.timeLeft--;
      } else if (this.timeLeft === 0 && !this.isAnswerSubmitted) {
        this.submitAnswer();
      }
    }, 1000);
  }

  selectAnswer(index: number): void {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswer = index;
    }
  }

  submitAnswer(): void {
    if (this.selectedAnswer !== null && this.currentQuestion && !this.isAnswerSubmitted) {
      const timeTaken = (Date.now() - this.startTime) / 1000;
      this.isAnswerSubmitted = true;
      
      this.socketService.submitAnswer(this.currentQuestion.id, this.selectedAnswer);
      this.notificationService.answerSubmitted();

      // Update difficulty based on performance
      this.difficultyService.adjustDifficulty(
        this.selectedAnswer,
        this.currentQuestion.correctAnswer,
        timeTaken
      );

      // Update player score
      if (this.selectedAnswer === this.currentQuestion.correctAnswer) {
        this.playerScore += 100;
      }
    }
  }
} 