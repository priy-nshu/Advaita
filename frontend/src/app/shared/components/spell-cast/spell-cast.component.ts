import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-spell-cast',
  template: `
    <div class="spell-cast-container">
      <div class="spell-input">
        <input
          type="text"
          [(ngModel)]="spellName"
          (keyup.enter)="castSpell()"
          placeholder="Enter spell name..."
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div class="spell-animation" *ngIf="isCasting">
        <div class="spell-effect"></div>
      </div>
      <div class="spell-result" *ngIf="spellResult">
        <p [class.text-green-600]="spellResult.success" [class.text-red-600]="!spellResult.success">
          {{ spellResult.message }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .spell-cast-container {
      @apply relative;
    }
    .spell-animation {
      @apply absolute inset-0 flex items-center justify-center pointer-events-none;
    }
    .spell-effect {
      @apply w-16 h-16 rounded-full bg-blue-500 opacity-50 animate-pulse;
    }
  `]
})
export class SpellCastComponent {
  @Input() spells: string[] = [];
  @Output() spellCast = new EventEmitter<{spell: string, success: boolean}>();

  spellName = '';
  isCasting = false;
  spellResult: { success: boolean; message: string } | null = null;

  castSpell(): void {
    if (!this.spellName.trim()) return;

    this.isCasting = true;
    const spell = this.spellName.trim();
    const success = this.spells.includes(spell);

    setTimeout(() => {
      this.isCasting = false;
      this.spellResult = {
        success,
        message: success ? 'Spell cast successfully!' : 'Spell failed!'
      };
      this.spellCast.emit({ spell, success });
    }, 1000);
  }
} 