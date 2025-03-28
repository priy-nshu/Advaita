import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { QuizRoomComponent } from './components/quiz-room/quiz-room.component';
import { QuizLobbyComponent } from './components/quiz-lobby/quiz-lobby.component';
import { QuizResultComponent } from './components/quiz-result/quiz-result.component';
import { QuizStadiumComponent } from './components/quiz-stadium/quiz-stadium.component';

const routes: Routes = [
  { path: '', component: QuizLobbyComponent },
  { path: 'room', component: QuizRoomComponent },
  { path: 'stadium', component: QuizStadiumComponent },
  { path: 'result', component: QuizResultComponent }
];

@NgModule({
  declarations: [
    QuizRoomComponent,
    QuizLobbyComponent,
    QuizResultComponent,
    QuizStadiumComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class QuizModule { } 