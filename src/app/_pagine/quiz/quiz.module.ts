import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { MenuComponent } from './componenti/menu/menu.component';
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { InfoDisplayComponent } from './componenti/info-display/info-display.component';


@NgModule({
  declarations: [
    QuizComponent,
    MenuComponent,
    InfoDisplayComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule, 
    NgbOffcanvasModule
  ]
})
export class QuizModule { }
