import { Component } from '@angular/core';

export type VoiceMenu = {
  link: string,
  icon?: string,
  name: string
}

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
