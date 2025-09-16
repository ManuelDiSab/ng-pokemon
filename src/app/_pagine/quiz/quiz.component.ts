import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ApiService } from '../../_servizi/api.service';
import { UtilityService } from '../../_servizi/utility.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { IGen } from '../../interface/IGen.interface';
import { difficultyPresets } from '../../interface/IDifficolta.interface';
import { difficolta } from '../../_tipi/Difficolta.type';
import { ConnectionService } from '../../_servizi/connection.service';

interface pokemon {
    nome: string
    sprite: string
    idGen: number
    idPokemon: number
}

@Component({
    selector: 'app-quiz',
    standalone: false,
    templateUrl: './quiz.component.html',
    styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnDestroy, OnInit {
    counter: number = 0
    serie: number = 0
    miglior_serie: number = 0
    sconfitta: boolean = false
    vittoria: boolean = false
    is_loading: boolean = false
    start: boolean = false
    private startTempo!: number
    rispostaPiuVeloce: number | null = null
    private viteTotali!: number
    private viteAttuali!: number
    secondi!: number
    tempoCritico!: number
    difficolta: difficolta = 'media'
    private preset = difficultyPresets[this.difficolta];
    generazioni$: Observable<any>
    generazioni: IGen[] = []
    selectedGens: number[] = []
    percentualeTimer: number = 100;
    @ViewChild('risposta') risposta!: ElementRef
    @ViewChild('skip') skip!: ElementRef
    @ViewChild('pokemonContainer') pokemonContainer!: ElementRef
    indovinato: boolean = false
    indovinati: number[] = []
    da_indovinare: number = 0
    punteggio: number = 0
    pokemon$: Observable<any>
    pokemon: pokemon = {
        nome: '',
        sprite: '',
        idGen: 0,
        idPokemon: 0
    }
    interval: any
    url_sprite: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
    hudHeight: number = 0

    constructor(private api: ApiService, private UT: UtilityService, private cn: ConnectionService,
        private el: ElementRef, private renderer: Renderer2) {
        this.pokemon$ = this.api.getDettaglioPokemon(this.NumeroCasuale())
        this.generazioni$ = this.api.getGenerazioni().pipe(
            map((rit: any) => rit.data.map(
                (rit2: any) => rit2.nome.replace('Generazione', '')
            ))
        )
    }

    ngOnInit(): void {
        this.generazioni$.subscribe(rit => {
            this.generazioni = rit
        })

    }
    ngOnDestroy(): void {
        clearInterval(this.interval)

    }

    /**
     * Calcolo in base ala larghezza se sono su mobile
     * @returns boolean
     */
    isMobile(): boolean {
        return window.innerWidth <= 768;
    }


    onInputFocus() {
        if (!this.isMobile()) return; // SOLO mobile
        // aggiungo una classe al contenitore principale
        this.el.nativeElement
            .querySelector('.gioco')
            .classList.add('keyboard-open');

        // impedisco che iOS scrolli automaticamente
        setTimeout(() => {
            this.risposta.nativeElement.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
        }, 300);
    }

    onInputBlur() {
        if (!this.isMobile()) return; // SOLO mobile
        // tolgo la classe quando chiudi la tastiera
        this.el.nativeElement
            .querySelector('.gioco')
            .classList.remove('keyboard-open');
    }

    /**
     * Carica un nuovo Pokémon casuale da indovinare.
     *
     * Flusso della funzione:
     * 1. Reset del timer della partita.
     * 2. Richiesta API per ottenere i dettagli di un Pokémon scelto casualmente.
     * 3. Caricamento dell’immagine dello sprite corrispondente.
     * 4. Una volta che l’immagine è stata caricata con successo:
     *    - vengono aggiornati i dati del Pokémon corrente (nome, generazione, sprite),
     *    - viene disattivato lo stato di "loading"
     *    - viene riavviato il timer della partita
     *    - viene abilitato e portato il focus sull’input della risposta.
    */
    caricaPokemon() {
        this.resetTimer();
        this.is_loading = true
        const idPokemon = this.NumeroCasuale();
        this.pokemon$ = this.api.getDettaglioPokemon(idPokemon).pipe(
            switchMap((rit: any) => {
                const spriteUrl = `${this.url_sprite}/${rit.data.idPokemon}.png`;
                const img = new Image();

                return new Observable(observer => {
                    img.onload = () => {
                        observer.next({
                            nome: this.UT.cambiaNomePokemonQuiz(rit.data.nome),
                            idGen: rit.data.idGen,
                            sprite: spriteUrl,
                            idPokemon: rit.data.idPokemon
                        });
                        observer.complete();
                    };
                    img.onerror = (err) => observer.error(err);
                    img.src = spriteUrl;
                });
            }),
            tap((pokemon: any) => {
                this.pokemon = pokemon;
                this.is_loading = false;
                this.startTempo = performance.now()
                this.startTimer();

                this.risposta.nativeElement.disabled = false;
                this.skip.nativeElement.disabled = false
                this.risposta.nativeElement.focus({ preventScroll: true });
            })
        );

        this.pokemon$.subscribe();
    }



    iniziaPartita() {
        const preset = difficultyPresets[this.difficolta];
        this.viteTotali = preset.viteTotali;
        this.viteAttuali = preset.viteTotali;
        this.secondi = preset.secondiIniziali;
        this.tempoCritico = preset.tempoCritico;
        this.start = true;
        this.caricaPokemon();
    }


    /**
     * Resetto il timer
     */
    resetTimer() {
        clearInterval(this.interval)
        const preset = difficultyPresets[this.difficolta];
        this.secondi = preset.secondiIniziali;
    }

    /**
     * Funzione per resettare il gioco e tornare alla schermata di inizio
     * Nella funzione resettoi tutti le variabili ai loro valori iniziali
     */
    game_reset() {
        clearInterval(this.interval)
        this.sconfitta = false
        this.start = false
        this.serie = 0
        this.miglior_serie = 0
        this.punteggio = 0
        this.rispostaPiuVeloce = null
        this.counter = 0
        this.indovinati = []
    }

    get arrayVite(): boolean[] {
        return Array.from({ length: this.viteTotali }, (_, i) => i < this.viteAttuali);
    }

    /**
     * Ritora il numero di pokemon ancora da indovinare
     * @returns array di numeri di pokemon da indovinare ancora
     */
    getPokemonDisponibili(): number[] {
        const rangePerGen: { [key: number]: [number, number] } = {
            1: [1, 151],
            2: [152, 251],
            3: [252, 386],
            4: [387, 493],
            5: [494, 649],
            6: [650, 721],
            7: [722, 809],
            8: [810, 905],
            9: [906, 1025]
        };

        const gens = this.selectedGens.length > 0 ? this.selectedGens : Object.keys(rangePerGen).map(Number);

        let disponibili: number[] = [];

        gens.forEach(g => {
            const [min, max] = rangePerGen[g];
            for (let i = min; i <= max; i++) {
                if (!this.indovinati.includes(i)) {
                    disponibili.push(i);
                }
            }
        });

        return disponibili;
    }


    NumeroCasuale(): number {
        const disponibili = this.getPokemonDisponibili();
        if (disponibili.length === 0) {
            // Hai finito tutti i Pokémon disponibili
            this.vittoria = true;
            return 0;
        }
        const index = Math.floor(Math.random() * disponibili.length);
        this.da_indovinare = disponibili.length
        return disponibili[index];
    }




    /**
     * Vedo se il valore dell'input corrisponde al nome del pokemon. 
     * Se corrisponde il pokemon è indovinato
     * @param input nome del pokemon inserito nell'input
     */
    guessPokemon(input: string) {
        if (input.toLowerCase() === this.pokemon.nome.toLowerCase()) {
            this.indovinato = true
            this.counter++
            this.serie++
            // this.risposta.nativeElement.disabled = true
            clearInterval(this.interval)
            const tempoRisposta = (performance.now() - this.startTempo) / 1000;
            this.aggiornaPunteggio(tempoRisposta)
            // Se è la prima volta o più veloce della precedente → aggiorno
            if (this.rispostaPiuVeloce === null || tempoRisposta < this.rispostaPiuVeloce) {
                this.rispostaPiuVeloce = tempoRisposta;
            }

            // Aggiungo il Pokémon all'array dei pokemon già indovinati
            if (!this.indovinati.includes(this.pokemon.idPokemon)) {
                this.indovinati.push(this.pokemon.idPokemon);
            }
            if (this.serie > this.miglior_serie) this.miglior_serie = this.serie
            setTimeout(() => {
                this.prossimo()
            }, 2000)
        }
    }

    /**
     * Gestisce la logica quando si passa al prossimo Pokémon.
     * Se non si è indovinato, decrementa le vite.
     * Poi carica il prossimo Pokémon o termina il gioco se le vite sono finite.
     */
    prossimo(): void {

        if (!this.indovinato) {
            this.perdiVita();
        }
        if (this.viteAttuali === 0) {
            this.sconfitta = true;
            clearInterval(this.interval)
        } else {
            this.skip.nativeElement.disabled = true
            this.preparaProssimoPokemon();
        }
    }

    /**
     * Decrementa le vite e resetta la serie in corso.
     */
    private perdiVita(): void {
        this.viteAttuali--;
        this.serie = 0;
    }

    /**
     * Prepara il prossimo Pokémon:
     * - resetta input e stato di indovinato
     * - avvia il caricamento del Pokémon
     */
    private preparaProssimoPokemon(): void {
        this.indovinato = false;
        this.risposta.nativeElement.value = '';
        this.caricaPokemon();
    }

    /**
     * Funzione per iniziare il timer 
     * Se il tempo finisce si va al prossimo pokemon, 
     * a meno che non si perda. 
     */
    startTimer(): void {
        this.interval = setInterval(() => {
            if (this.secondi > 0) {
                this.secondi -= 0.1; // riduci di 0.1 secondi
                this.secondi = Math.max(this.secondi, 0); // evita valori negativi
                this.percentualeTimer = (this.secondi / this.preset.secondiIniziali) * 100;
            } else {
                clearInterval(this.interval);
                this.prossimo();
            }
        }, 100); // 100ms
    }

    onSelectedGensChange(gens: number[]) {
        this.selectedGens = gens;
        // Opzionale: carica subito un nuovo Pokémon quando cambia la selezione
        if (this.start) {
            this.caricaPokemon();
        }
    }


    cambioDifficolta(diff: difficolta) {
        console.log('evento', diff)
        this.difficolta = diff
    }
    aggiornaPunteggio(tempo: number): void {
        const moltiplicatori: Record<difficolta, number> = {
            facile: 1,
            media: 1.5,
            difficile: 2
        };
        const maxTime = difficultyPresets[this.difficolta].secondiIniziali;

        // tempo rimanente = maxTime - tempoRisposta (ma mai sotto 0)
        const tempoRimanente = Math.max(0, maxTime - tempo);

        // punti base
        const punti = tempoRimanente * 100;

        // applico moltiplicatore
        this.punteggio += Math.floor(punti * moltiplicatori[this.difficolta]);
    }


    /**
     * Getter per ottenere la risposta più veloce da mostrare nel template
     */
    get rispostaPiuVeloceLabel(): string {
        if (this.rispostaPiuVeloce === null) {
            return 'N/A';
        }
        return `${this.rispostaPiuVeloce.toFixed(2)}s`;
    }
}   
