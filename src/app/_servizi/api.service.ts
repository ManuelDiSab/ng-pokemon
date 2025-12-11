import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private pokeApiUrl = environment.pokeApiUrl
    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient) { }


    /**
     * Endpoint per ottenere la lista pokemon con possibilità di filtraggio
     * con diverse query
     * @param query query per filtrare la lista
     * @returns Observable
     */
    getPokemonList(query: HttpParams | null = null, pagina: number, sort: string = 'id', order: string = 'asc'): Observable<any> {
        // Se la query esiste la ggiungo all'url altrimenti utilizzo quello di base
        return !query ? this.http.get(`${this.apiUrl}/pokemon?sort=${sort}&order=${order}&page=${pagina}`)
            : this.http.get(`${this.apiUrl}/pokemon?sort=${sort}&order=${order}&page=${pagina}`, { params: query })
    }

    /**
     * Ritorno i dettagli del pokemon specificato con il nome
     * @param nome nome del pokemon
     * @returns 
     */
    getPokemonDetails(nome: string) {
        return this.http.get(`${this.pokeApiUrl}/pokemon/${nome}`)
    }

    /**
     * Richiamo endpoint per la collection dei tipi 
     * @returns Observable<any>
     */
    getTipi() {
        return this.http.get(`${this.apiUrl}/tipi`)
    }

    getEvolutionChain(url: string) {
        return this.http.get(url)
    }

    getDettaglioSpecie(nome: string) {
        return this.http.get(`${this.pokeApiUrl}/pokemon-species/${nome}`)
    }

    getAbilityDetails(abilita: string) {
        return this.http.get(`${this.pokeApiUrl}/ability/${abilita}`)
    }

    getGenerazioni() {
        return this.http.get(`${this.apiUrl}/generazioni`)
    }

    getDettaglioPokemon(idPokemon: number, query: string | null = null) {
        return query ? this.http.get(`${this.apiUrl}/pokemon/${idPokemon}${query}`) : this.http.get(`${this.apiUrl}/pokemon/${idPokemon}`)
    }


    getPokemonDaPokeApi(url: string) {
        return this.http.get(url)
    }

    getSpeciePokemon(id: number) {
        return this.http.get(`${this.apiUrl}/pokemon/${id}`)
    }

    getListaPokemonCompleta(): Observable<any> {
        return this.http.get(`${this.pokeApiUrl}/pokemon?limit=1025`);
    }

    getGenerico(url: string): Observable<any> {
        return this.http.get(url)
    }
}
