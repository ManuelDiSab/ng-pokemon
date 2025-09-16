import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class PokemonService {

    private nomiPokemonSubject = new BehaviorSubject<string[]>([])
    public nomiPokemon$ = this.nomiPokemonSubject.asObservable()

    private caricato: boolean = false

    constructor(private api: ApiService) { }

    caricaNomiPokemon(): void {
        if (this.caricato) return
        this.api.getListaPokemonCompleta().pipe(
            tap((x: any) => {
                const nomi = x.results.map( (a:{name:string, url:string}) => a.name.toLowerCase())
                this.nomiPokemonSubject.next(nomi),
                this.caricato = true
            }),
            catchError(err => {
                console.error(err)
                return of([])
            })
        ).subscribe()
    }
    
    
    ricercaPokemon(input: string, limit:number = 5) {
        const list = this.nomiPokemonSubject.getValue()
        if (!input) return []
        const term = input.toLowerCase()
        return list.filter(p => p.includes(term)).slice(0, limit);
    }
}
