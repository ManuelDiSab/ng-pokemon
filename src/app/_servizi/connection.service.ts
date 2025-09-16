import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, mapTo, merge, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    private ConnessioneSub = new BehaviorSubject<boolean>(navigator.onLine)
    public online$ = this.ConnessioneSub.asObservable()
    private _isLoading$ = new BehaviorSubject<boolean>(false)

    // Getter pubblico come Observable (così da non modificare direttamente da fuori)
    isLoading$ = this._isLoading$.asObservable()

    vedo() {
        setTimeout(() => this._isLoading$.next(true))
    }

    non_vedo() {
        setTimeout(() => this._isLoading$.next(false))
    }

    constructor() {
        merge(
            of(navigator.onLine),
            fromEvent(window, 'online').pipe(map(() => true)),
            fromEvent(window, 'offline').pipe(map(() => false))
        ).subscribe(stato => {
            this.ConnessioneSub.next(stato)
        })
    }
}
