import { Component } from '@angular/core';

@Component({
  selector: 'toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  voci:{nome:string, link:string, icona?:string}[]= [ 
    {nome:'HOMEPAGE', link:'', icona:'/pokeball.svg'},{nome:'POKEDEX', link:'pokedex'},{nome:'QUIZ', link:"quiz"}
  ]
}
