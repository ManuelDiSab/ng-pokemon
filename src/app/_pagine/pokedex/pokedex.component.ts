import { Component, HostListener, OnInit, } from '@angular/core';
import { ApiService } from '../../_servizi/api.service';
import { Meta, Title } from '@angular/platform-browser';
import { ICard } from '../../interface/ICard.interface';
import { finalize } from 'rxjs';
import { UtilityService } from '../../_servizi/utility.service';
import { ConnectionService } from '../../_servizi/connection.service';
import { HttpParams } from '@angular/common/http';
import { PokemonService } from '../../_servizi/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { TraduzioniService } from '../../_servizi/traduzioni.service';

@Component({
    selector: 'app-pokedex',
    standalone: false,
    templateUrl: './pokedex.component.html',
    styleUrl: './pokedex.component.scss'
})
export class PokedexComponent implements OnInit {

    // URL base per le sprite ufficiali dei Pokémon
    readonly url_sprite: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'
    // Stato di caricamento per eventuali spinner
    loading: boolean = false
    // Query da inviare all'API (può contenere nome, tipo, filtri ecc.)
    query: HttpParams = new HttpParams()
    // Paginazione
    current_page: number = 1
    last_page: number = this.current_page--
    // Array di nomi totali dei Pokémon disponibili (per autocomplete o filtri)
    nomi_totali_pokemon: string[] = []
    // Lista principale dei Pokémon caricati
    pokemonList: ICard[] = []
    // Lista filtrata (potresti usarla per filtri interni)
    pokemonFiltrati: ICard[] = []
    // Controlli per suggerimenti o dropdown
    ulAperta: boolean = false
    suggestioni: any[] = []
    // Messaggio quando non ci sono Pokémon da caricare
    noPage_message: string = ''
    // Ordinamento predefinito
    ordine: string = 'id-asc'

    constructor(
        private api: ApiService,              // Servizio per chiamate API
        private titleService: Title,          // Servizio per aggiornare il titolo della pagina
        private metaService: Meta,            // Servizio per aggiornare i meta tag
        private TR: TraduzioniService,           // Utility generiche (es: TraduciTipo)
        private CN: ConnectionService,        // Controllo connessione / loading
        private PS: PokemonService,           // Servizio Pokémon (nomi, ricerche, ecc.)
        private route: ActivatedRoute         // Per leggere query params dall'URL
    ) { }

    ngOnInit(): void {
        // Sottoscrizione all’Observable dei nomi dei Pokémon
        this.PS.nomiPokemon$.subscribe(lista => {
            this.nomi_totali_pokemon = lista;
        });

        // Sottoscrizione ai queryParams della route
        // Permette di leggere la ricerca o i filtri dall’URL
        this.route.queryParams.subscribe(params => {
            if (params['nome']) {
                // Se esiste la query "nome", impostala nei parametri
                this.query = new HttpParams().set('nome', params['nome']);
            } else {
                // Altrimenti resetta la query
                this.query = new HttpParams();
            }

            // Reset paginazione e lista Pokémon
            this.current_page = 1;
            this.pokemonList = [];

            // Carica i Pokémon secondo la query
            this.caricaPokemon();
        });

        // Imposta il titolo della pagina
        this.titleService.setTitle('Lista Pokémon | Gotta Catch');

        // Imposta meta description
        this.metaService.updateTag({
            name: 'description',
            content: 'Scopri tutti i Pokémon dalla PokéAPI'
        });
    }

    /**
     * Funzione per scrollare all'inizio della pagina del opkedex
     */
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Carica la lista di Pokémon usando l'API e la query corrente
     */
    caricaPokemon() {
        this.CN.vedo();

        // Chiamata API per lista Pokémon
        this.api.getPokemonList(this.query, this.current_page, this.ordine).pipe(
            finalize(() => this.CN.non_vedo()) // Nascondo il loader alla fine
        ).subscribe(
            this.osservatorePokemon(this.pokemonList, this.url_sprite)
        );
    }

    /**
     * Modifica l'ordinamento dei Pokémon (es: id-asc, id-desc)
     * e ricarica la lista dalla prima pagina
     */
    ordinamento(e: Event) {
        this.current_page = 1;
        const ordinamento = (e.currentTarget as HTMLSelectElement).value;
        this.ordine = ordinamento;

        // Reset lista prima di ricaricare
        this.pokemonList = [];
        this.caricaPokemon();
    }

    /**
     * Applicazione dei filtri interni al Pokedex
     * @param string HttpParams contenente filtri tipo, leggendari, ecc.
     */
    onFiltriApplicati(string: HttpParams) {
        this.current_page = 1;
        this.pokemonList = [];
        this.query = string;
        // Ricarica lista con filtri applicati
        this.caricaPokemon();
    }

    /**
     * Funzione per caricare Pokémon secondo una query specifica
     * Usata ad esempio dalla SearchBar
     * @param ricerca HttpParams della query
     */
    onSubmit(ricerca: HttpParams): void {
        this.pokemonList = [];
        this.query = ricerca;
        this.current_page = 1;
        this.caricaPokemon();
    }

    /**
     * Osservatore per la risposta API dei Pokémon
     * @param arr_pokemon Array dove salvare i Pokémon
     * @param url_sprite URL base per le sprite
     */
    public osservatorePokemon(arr_pokemon: ICard[], url_sprite: string) {
        return {
            // Gestione dati in arrivo
            next: (rit: any) => {
                // Se non ci sono Pokémon, mostra messaggio
                rit.meta.from === null ? this.noPage_message = 'Non ci sono pokemon da caricare' : this.noPage_message = '';

                const elem = rit.data;

                // Ciclo su tutti i Pokémon ricevuti
                for (let i = 0; i < elem.length; i++) {
                    const tmp: ICard = {
                        id: elem[i].idPokemon,
                        idGen: elem[i].idGen,
                        nome: elem[i].nome,
                        sprite: `${url_sprite}${elem[i].idPokemon}.png`,
                        is_legendary: elem[i].is_legendary,
                        is_mythical: elem[i].is_mythical,
                        tipo1: this.TR.TraduciTipo(elem[i].tipi[0].nome),
                        tipo2: this.TR.TraduciTipo(elem[i].tipi[1]?.nome),
                        stats: elem[i].stats
                    };
                    // Aggiungo il Pokémon alla lista
                    arr_pokemon.push(tmp);
                }
            },

            // Gestione errori API
            error: (err: any) => {
                console.log('error:', err);
            },

            // Azioni da eseguire al completamento della chiamata
            complete: () => {
                this.current_page++;
                console.log('completato', this.current_page);

                // Nasconde messaggio di "nessun Pokémon" dopo 10 secondi
                setTimeout(() => { this.noPage_message = '' }, 10000);
            }
        };
    }
}
