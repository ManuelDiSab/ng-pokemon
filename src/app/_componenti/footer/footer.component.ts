import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  ora: Date = new Date
  anno: number = this.ora.getFullYear()
  contatti: { nome: string, url: string, icon: string, colore: string }[] = [
    {
      url: 'https://github.com/MAnuelDiSab',
      nome: 'GitHub',
      icon: 'fa-brands fa-github',
      colore: 'black'
    },
    {
      url: 'https://www.linkedin.com/in/manuel-di-sabatino/',
      nome: 'Linkedin',
      icon: 'fa-brands fa-linkedin',
      colore: 'blue'
    },
    {
      url: 'mailto:manueldisabat@gmail.com',
      nome: 'Mail me',
      icon: 'fa-solid fa-envelope',
      colore: 'black'
    }
  ]
}
