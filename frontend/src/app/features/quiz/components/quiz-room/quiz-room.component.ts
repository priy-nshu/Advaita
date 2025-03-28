import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../../../core/services/socket.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-quiz-room',
  template: `
    <div class="quiz-container">
      <div class="question-card" *ngIf="currentQuestion">
        <h2 class="text-xl font-bold mb-4">{{ currentQuestion.question }}</h2>
        <div class="space-y-2">
          <div
            *ngFor="let option of currentQuestion.options; let i = index"
            class="answer-option"
            [class.selected]="selectedAnswer === i"
            [class.correct]="showResults && i === currentQuestion.correctAnswer"
            [class.incorrect]="showResults && selectedAnswer === i && i !== currentQuestion.correctAnswer"
            (click)="selectAnswer(i)"
            [class.disabled]="showResults"
          >
            {{ option }}
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            Question {{ currentQuestionNumber }}/{{ totalQuestions }}
          </div>
          <button
            *ngIf="!showResults"
            (click)="submitAnswer()"
            [disabled]="selectedAnswer === null"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Answer
          </button>
        </div>
      </div>
      <div *ngIf="!currentQuestion" class="text-center">
        <div class="loading-spinner mx-auto"></div>
      </div>
    </div>
  `,
  styles: []
})
export class QuizRoomComponent implements OnInit, OnDestroy {
  currentQuestion: any = null;
  selectedAnswer: number | null = null;
  showResults = false;
  currentQuestionNumber = 0;
  totalQuestions = 10;

  constructor(
    private socketService: SocketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.socketService.onQuestionReceived().subscribe(question => {
      this.currentQuestion = question;
      this.selectedAnswer = null;
      this.showResults = false;
      this.currentQuestionNumber++;
    });

    this.socketService.onGameEnd().subscribe(result => {
      this.showResults = true;
      this.notificationService.gameEnded(result.winner);
    });
  }

  ngOnDestroy(): void {
    this.socketService.leaveMatchmaking();
  }

  selectAnswer(index: number): void {
    if (!this.showResults) {
      this.selectedAnswer = index;
    }
  }

  submitAnswer(): void {
    if (this.selectedAnswer !== null && this.currentQuestion) {
      this.socketService.submitAnswer(this.currentQuestion.id, this.selectedAnswer);
      this.notificationService.answerSubmitted();
    }
  }
} 