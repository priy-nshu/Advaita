import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpellCastComponent } from './components/spell-cast/spell-cast.component';
import { QuidditchPlayerComponent } from './components/quidditch-player/quidditch-player.component';
import { HouseBannerComponent } from './components/house-banner/house-banner.component';

@NgModule({
  declarations: [
    SpellCastComponent,
    QuidditchPlayerComponent,
    HouseBannerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SpellCastComponent,
    QuidditchPlayerComponent,
    HouseBannerComponent
  ]
})
export class SharedModule { } 