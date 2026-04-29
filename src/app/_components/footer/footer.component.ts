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
}
