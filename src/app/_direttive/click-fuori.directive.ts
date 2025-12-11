import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[clickFuori]',
    standalone: false
})
export class ClickFuoriDirective {
    @Output() ClickOutside = new EventEmitter<void>()
    constructor(private el: ElementRef) { }
    @HostListener('document:click', ['$event'])
    @HostListener('document:touchstart', ['$event'])
    public onClick(event: Event) {
        const target = event.target as HTMLElement
        const clickInside = this.el.nativeElement.contains(target)
        const isVisible = this.el.nativeElement.offsetParent !== null;
        if (!clickInside && isVisible) {
            this.ClickOutside.emit()
        }
    }

}
