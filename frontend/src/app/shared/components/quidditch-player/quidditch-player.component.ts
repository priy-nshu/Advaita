import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quidditch-player',
  template: `
    <div class="quidditch-player">
      <div class="player-info">
        <div class="player-name">{{ playerName }}</div>
        <div class="player-score">Score: {{ score }}</div>
      </div>
      <div class="player-status">
        <div class="status-indicator" [class.active]="isActive"></div>
        <div class="status-text">{{ isActive ? 'Active' : 'Inactive' }}</div>
      </div>
      <div class="player-stats">
        <div class="stat">
          <span class="stat-label">Speed:</span>
          <span class="stat-value">{{ speed }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Accuracy:</span>
          <span class="stat-value">{{ accuracy }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quidditch-player {
      @apply bg-white rounded-lg shadow-md p-4;
    }
    .player-info {
      @apply mb-4;
    }
    .player-name {
      @apply text-xl font-bold text-gray-800;
    }
    .player-score {
      @apply text-lg text-gray-600;
    }
    .player-status {
      @apply flex items-center mb-4;
    }
    .status-indicator {
      @apply w-3 h-3 rounded-full bg-red-500 mr-2;
    }
    .status-indicator.active {
      @apply bg-green-500;
    }
    .status-text {
      @apply text-sm text-gray-600;
    }
    .player-stats {
      @apply grid grid-cols-2 gap-4;
    }
    .stat {
      @apply flex justify-between items-center;
    }
    .stat-label {
      @apply text-gray-600;
    }
    .stat-value {
      @apply font-semibold text-gray-800;
    }
  `]
})
export class QuidditchPlayerComponent {
  @Input() playerName = '';
  @Input() score = 0;
  @Input() isActive = false;
  @Input() speed = 0;
  @Input() accuracy = 0;
} 