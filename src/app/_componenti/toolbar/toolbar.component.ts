import { Component } from '@angular/core';
import { VoiceMenu } from '../../_tipi/VoiceMenu.type';
@Component({
  selector: 'toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  voci: VoiceMenu[] = [
    { name: 'HOMEPAGE', link: 'homepage', icon: '/pokeball.svg' },
    { name: 'POKEDEX', link: 'pokedex' },
    { name: 'QUIZ', link: "quiz" }
  ]
}
