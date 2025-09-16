import { Component, EventEmitter, inject, Input, Output, signal, TemplateRef, WritableSignal } from '@angular/core';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IGen } from '../../../../interface/IGen.interface';
import { difficolta } from '../../../../_tipi/Difficolta.type';


@Component({
    selector: 'menu-quiz',
    standalone: false,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    @Input() start:boolean = false
    @Input() gen: IGen[] = []
    @Input() selectedGens: number[] = []; // generazioni selezionate dal padre
    @Output() selectedGensChange = new EventEmitter<number[]>(); // evento per aggiornare il padre

    @Input('difficolta') difficolta!: difficolta
    @Output() difficoltaChange = new EventEmitter<difficolta>()

    private offcanvasService = inject(NgbOffcanvas);
    closeResult: WritableSignal<string> = signal('');
    difficolta_template: { nome: difficolta, valore: number }[] = [{ nome: 'facile', valore: 1 },
    { nome: 'media', valore: 2 }, { nome: 'difficile', valore: 3 }]

    

    toggleGen(gen:number){
        const index = this.selectedGens.indexOf(gen)
        if(index > -1){
            this.selectedGens.splice(index, 1)
        }else{
            this.selectedGens.push(gen)
        }
        console.log('', [...this.selectedGens])
        this.selectedGensChange.emit([...this.selectedGens])
    }
    onValueChange(e:Event){
        const n = (e.currentTarget as HTMLButtonElement).value as difficolta
        this.difficoltaChange.emit(n)
    }


    open(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
            (result) => {
                this.closeResult.set(`Closed with: ${result}`);
            },
            (reason) => {
                this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
            },
        );
    }

    private getDismissReason(reason: any): string {
        switch (reason) {
            case OffcanvasDismissReasons.ESC:
                return 'by pressing ESC';
            case OffcanvasDismissReasons.BACKDROP_CLICK:
                return 'by clicking on the backdrop';
            default:
                return `with: ${reason}`;
        }
    }
}
