import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-house-banner',
  template: `
    <div class="house-banner" [ngClass]="houseClass">
      <div class="banner-content">
        <div class="house-crest">
          <img [src]="crestUrl" [alt]="houseName + ' crest'" class="w-16 h-16">
        </div>
        <div class="house-info">
          <h2 class="house-name">{{ houseName }}</h2>
          <p class="house-motto">{{ houseMotto }}</p>
        </div>
        <div class="house-stats">
          <div class="stat">
            <span class="stat-label">Points:</span>
            <span class="stat-value">{{ points }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Rank:</span>
            <span class="stat-value">{{ rank }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .house-banner {
      @apply rounded-lg shadow-lg p-4 text-white;
    }
    .gryffindor {
      @apply bg-gradient-to-r from-red-600 to-red-800;
    }
    .slytherin {
      @apply bg-gradient-to-r from-green-600 to-green-800;
    }
    .ravenclaw {
      @apply bg-gradient-to-r from-blue-600 to-blue-800;
    }
    .hufflepuff {
      @apply bg-gradient-to-r from-yellow-600 to-yellow-800;
    }
    .banner-content {
      @apply flex items-center justify-between;
    }
    .house-info {
      @apply text-center;
    }
    .house-name {
      @apply text-2xl font-bold mb-2;
    }
    .house-motto {
      @apply text-sm opacity-90;
    }
    .house-stats {
      @apply flex gap-4;
    }
    .stat {
      @apply flex flex-col items-center;
    }
    .stat-label {
      @apply text-sm opacity-90;
    }
    .stat-value {
      @apply text-xl font-bold;
    }
  `]
})
export class HouseBannerComponent {
  @Input() houseName = '';
  @Input() houseMotto = '';
  @Input() points = 0;
  @Input() rank = 0;
  @Input() crestUrl = '';

  get houseClass(): string {
    return this.houseName.toLowerCase();
  }
} 