import { Component, Input } from '@angular/core';

@Component({
    selector: 'info-pokemon',
    standalone: false,
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss'
})
export class InfoComponent {
    @Input('data') data!: any
    @Input ('colori')colori!: { [key: string]: string }

}
