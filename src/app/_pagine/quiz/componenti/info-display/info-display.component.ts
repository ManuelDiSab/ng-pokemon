import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'info-display',
  standalone: false,
  templateUrl: './info-display.component.html',
  styleUrl: './info-display.component.scss'
})
export class InfoDisplayComponent {
  @Input('display') display!: 'desktop' | 'mobile'
  @Input() viteArray: boolean[] = [];
  @Input() secondi: number = 0;
  @Input() serie: number = 0;
  @Input() miglior_serie: number = 0;
  @Input() risposta_piu_veloce:number | string = ''
  @Input() punteggio: number = 0;
  @Input() tempoCritico:number = 0
  @Input() da_indovinare:number = 0
  @Output() reset = new EventEmitter<void>()
  onClickReset() {
    this.reset.emit()
  }
}
