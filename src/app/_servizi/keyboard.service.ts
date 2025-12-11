import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    private keyboardSubject = new BehaviorSubject<boolean>(false);
    keyboardOpened$ = this.keyboardSubject.asObservable();

    private keyboardHeightSubject = new BehaviorSubject<number>(0);
    keyboardHeight$ = this.keyboardHeightSubject.asObservable();

    constructor(private ngZone: NgZone) {
        this.setupListeners();
    }

    private setupListeners() {
        const viewport = window.visualViewport;

        if (viewport) {
            // iOS / Android moderni
            viewport.addEventListener('resize', () => this.onViewportChange());
            viewport.addEventListener('scroll', () => this.onViewportChange());
        }

        // fallback Android vecchi
        window.addEventListener('resize', () => this.onViewportChange());
    }

    private onViewportChange() {
        this.ngZone.run(() => {
            const viewport = window.visualViewport;

            const fullHeight = window.innerHeight;
            const visibleHeight = viewport ? viewport.height : fullHeight;

            const keyboardOpen = visibleHeight < fullHeight * 0.9;
            const keyboardHeight = keyboardOpen ? fullHeight - visibleHeight : 0;

            this.keyboardSubject.next(keyboardOpen);
            this.keyboardHeightSubject.next(keyboardHeight);
        });
    }
}
