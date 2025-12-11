import { AfterContentInit, AfterViewInit, Component, ContentChildren, Directive, Input, QueryList, TemplateRef } from '@angular/core';

@Directive({
    selector: '[accordion-item]',
    standalone: false
})
export class AccordionItem {
    @Input('accordion-item') title!: string
    open: boolean = false
    constructor(public template: TemplateRef<any>) { }
}


@Component({
    selector: 'my-accordion',
    standalone: false,
    templateUrl: './accordion.component.html',
    styleUrl: './accordion.component.scss'
})
export class AccordionComponent implements AfterContentInit {

    @ContentChildren(AccordionItem)
    items!: QueryList<AccordionItem>

    ngAfterContentInit(): void {
        // Lascio tutti vari accorion chiusi all'inizio
        this.items.forEach(i => i.open = false)
    }

    toggle(item: AccordionItem) {
        if (item.open) {
            // Se è già aperto, lo chiudo
            item.open = false;
        } else {
            // Altrimenti chiudo tutti gli altri e apro questo
            this.items.forEach(i => i.open = false);
            item.open = true;
        }
    }
}
