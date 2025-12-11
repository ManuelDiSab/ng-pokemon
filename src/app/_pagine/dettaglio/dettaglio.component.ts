import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../_servizi/api.service';
import { catchError, forkJoin, map, Observable, of, pipe, shareReplay, switchMap, tap } from 'rxjs';
import { ConnectionService } from '../../_servizi/connection.service';
import { UtilityService } from '../../_servizi/utility.service';
import { Meta, Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { TraduzioniService } from '../../_servizi/traduzioni.service';
type VociMenu = 'Dettagli' | 'Statistiche' | 'Debolezze' | 'Evoluzioni' | 'Galleria'

@Component({
    selector: 'app-dettaglio',
    standalone: false,
    templateUrl: './dettaglio.component.html',
    styleUrl: './dettaglio.component.scss'
})
export class DettaglioComponent implements OnInit, AfterViewInit {
    private verso!: HTMLAudioElement
    pokemonData$!: Observable<any>
    activeSection: string = '';
    titleCase = new TitleCasePipe()
    colori: any;
    voci: VociMenu[] = ['Dettagli', 'Statistiche', 'Debolezze', 'Evoluzioni'];
    constructor(private route: ActivatedRoute, private api: ApiService, private CO: ConnectionService, public UT: UtilityService,
        private title: Title, private metaService: Meta, private TR: TraduzioniService) {
        this.colori = this.UT.colori;
    }

    /**
     * Le pokeApi hanno due endpoint per prendere i dettagli completi di un pokemon, v2/pokemon/{nome} e v2/pokemon-species/{nome}. 
     * Alcuni pokemon hanno una variazione al nome che non è corretta per uno dei due endpoint
     * Questa funzione cerca di ovviare a questo problema sostituendo il nome del pokemon 
     * con la sua variante corretta SE presente nella variabile chiamata sostituzioni
     * (Potrebbero esserci altri pokemon che hanno bisogno di una variante o di essere modificati. 
     * Quelli in sosdtituzioni sono quelli in cui mi sono imbattuto personalmente. )
     * @param nome nome del pokemon da verificare
     * @returns nome del pokemon corretto
     */
    private cambioNomePokemon(nome: string): string {
        const sostituzioni: Record<string, string> = {
            'urshifu-single-strike': 'urshifu', 'palafin': 'palafin-zero', 'urshifu': 'urshifu-single-strike',
            'palafin-zero': 'palafin'
        }
        return sostituzioni[nome] ?? nome
    }

    @ViewChildren('sectionRef', { read: ElementRef }) sectionRef?: QueryList<ElementRef<HTMLElement>>
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.updateActiveSection(); // Aggiorna la sezione attiva durante lo scroll
    }
    ngAfterViewInit(): void {
        this.updateActiveSection(); // Inizializza la sezione attiva
    }
    ngOnInit(): void {

        // 1. Inizio lo stream partendo dai parametri dell'URL
        this.pokemonData$ = this.route.paramMap.pipe(
            // 2. Uso switchMap: annulla le richieste precedenti se ne arriva una nuova
            switchMap(params => {
                let pokemonName = params.get('pokemon');
                this.title.setTitle(`${this.titleCase.transform(pokemonName)} - Gotta Catch`);
                this.metaService.updateTag({ name: 'description', content: `Scopri tutti i dettagli di ${pokemonName}` });
                if (!pokemonName) return of(null); // Se non c'è il nome, non faccionulla
                this.CO.vedo(); // Mostro il loader ( pikachu che corre )
                // 3. Prima chiamata API per i dettagli base del Pokémon
                return this.api.getPokemonDetails(pokemonName).pipe(
                    // 4. Un altro switchMap per le chiamate che dipendono dalla prima
                    switchMap((pokemonDetails: any) => {
                        if (!pokemonDetails) {
                            this.CO.non_vedo();
                            return of(null); // Gestisce il caso in cui il pokemon non viene trovato
                        }
                        const abilityName = pokemonDetails.abilities[0].ability.name;
                        const secretAbility = pokemonDetails.abilities[1]?.ability.name ?? null;
                        // Preparo gli ID per il pokemon precedente e successivo
                        const prevId = pokemonDetails.id - 1 === 0 ? 1025 : pokemonDetails.id - 1;
                        const nextId = pokemonDetails.id + 1 === 1026 ? 1 : pokemonDetails.id + 1;
                        // 5. Uso forkJoin per eseguire in parallelo tutte le chiamate indipendenti
                        return forkJoin({
                            // In base all'endpoint delle v2/pokemon delle pokeApi devo usare urshifu-single-strike

                            specie: this.api.getDettaglioSpecie(this.cambioNomePokemon(pokemonName))
                            ,
                            prev: this.api.getPokemonDetails(prevId.toString()).pipe(
                                map((p: any) => ({ id: p.id, name: p.name, sprite: p.sprites?.other?.home?.front_default })),
                                catchError(() => of(null))
                            ),
                            next: this.api.getPokemonDetails(nextId.toString()).pipe(
                                map((p: any) => ({ id: p.id, name: p.name, sprite: p.sprites?.other?.home?.front_default })),
                                catchError(() => of(null))
                            ),
                            abilita: this.api.getAbilityDetails(abilityName),
                            abilita_nascosta: secretAbility ? this.api.getAbilityDetails(secretAbility) : of(null)
                        }).pipe(
                            switchMap(({ specie, prev, next, abilita, abilita_nascosta }: any) => {
                                return this.getEvolutionData(specie.evolution_chain.url).pipe(
                                    map((evoluzioniGrouped: any[][]) => {
                                        this.CO.non_vedo();
                                        return {
                                            details: {
                                                id: pokemonDetails.id,
                                                nome: this.cambioNomePokemon(pokemonDetails.name),
                                                sprite: pokemonDetails.sprites.other['official-artwork'].front_default,
                                                galleria: pokemonDetails.sprites,
                                                verso: pokemonDetails.cries?.latest,
                                                tipo1: this.TR.TraduciTipo(pokemonDetails.types[0].type.name),
                                                tipo2: pokemonDetails.types[1] ? this.TR.TraduciTipo(pokemonDetails.types[1]?.type.name) : null,
                                                stats: pokemonDetails.stats.map((s: any) => ({
                                                    nome: this.TR.map_stats_ita[s.stat.name] ?? s.stat.name,
                                                    base_stat: s.base_stat
                                                })),
                                                url_types: pokemonDetails.types.map((t: any) => t.type.url),
                                                peso: pokemonDetails.weight / 10,
                                                altezza: pokemonDetails.height / 10,
                                                abilita: abilita.names.find((a: any) => a.language.name === 'it')?.name ?? 'N/A',
                                                abilita2: abilita_nascosta?.names.find((a: any) => a.language.name === 'it')?.name ?? 'N/A',
                                                abilita_desc: abilita?.flavor_text_entries?.find((f: any) => f.language.name === 'it')?.flavor_text ?? 'Nessuna descrizione disponibile.',
                                                abilita_nascosta_desc: abilita_nascosta?.flavor_text_entries?.find((f: any) => f.language.name === 'it')?.flavor_text ?? 'Nessuna descrizione disponibile.'
                                            },
                                            species: {
                                                genera: specie?.genera.find((g: any) => g.language.name === 'it')?.genus ?? 'Sconosciuto',
                                                desc_1: specie?.flavor_text_entries.find((f: any) => f.language.name === 'it')?.flavor_text ?? 'Nessuna descrizione disponibile.',
                                                generazione: this.TR.map_gen[specie?.generation.name] ?? 'N/A',
                                                evolve_da: specie?.evolves_from_species?.name,
                                                fel_base: specie?.base_happiness,
                                                base_exp: pokemonDetails?.base_experience,
                                                tasso_di_cattura: specie?.capture_rate,
                                                genere: this.getGenderRatio(specie.gender_rate),
                                                forme: specie?.varieties.map((v: any) => ({ nome: v.pokemon.name, url: v.pokemon.url })) || [],
                                            },

                                            evolution_chain: evoluzioniGrouped, // raggruppoper stage: array di array
                                            prev,
                                            next
                                        };
                                    }),
                                    tap(x => console.log('ciao', x))
                                );
                            })
                        );
                    })
                )
            }),
            shareReplay(1)
        )
    }

    /**
 * Genera la stringa CSS per la sfumatura di background in base ai tipi.
 * @param type1 Il primo tipo del Pokémon.
 * @param type2 Il secondo tipo del Pokémon (opzionale).
 * @returns Una stringa CSS per la proprietà background-image.
 */
    getBackgroundGradient(type1: string, type2: string | null | undefined): string {
        const color1 = this.colori[type1];
        if (type2) {
            // Pokémon con DUE tipi
            const color2 = this.colori[type2];
            if (color1 && color2) {
                // Sfumatura lineare a 135 gradi (diagonale) tra i due colori
                return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            }
        }
        // Pokémon con UN solo tipo (o fallback in caso di colore mancante)
        if (color1) {
            // Sfumatura da colore1 a una tonalità più chiara di colore1 (o bianco/sfondo)
            // Per uno sfondo scuro, sfumiamo verso un colore leggermente più chiaro per l'effetto di luce
            // Ritorna una sfumatura radiale leggera come alternativa
            // return `radial-gradient(circle at 99% 1%, ${color1} 0%, rgba(255, 255, 255, 0.1) 100%)`;
            return color1
        }

        // Fallback: colore di sfondo predefinito
        return 'var(--bg-default, #6c757d)';
    }
    /**
     * Funzione per assegnare la sezione attiva giusta nel menu in alto
     * @returns 
     */
    updateActiveSection() {
        if (!this.sectionRef) return
        const sections = this.sectionRef.toArray()
        for (let i = 0; i < sections.length; i++) {
            const el = sections[i].nativeElement
            const rect = el.getBoundingClientRect()
            if (rect.top <= 120 && rect.bottom > 120) {
                this.activeSection = this.voci[i]
                return
            }
        }
        // se nessuna sezione corrisponde allora seleziono la prima di default
        this.activeSection = this.voci[0]
    }

    scrollTo(index: number) {
        const el = this.sectionRef?.toArray()[index + 1]?.nativeElement;
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    versoPokemon(src: string) {
        this.verso = new Audio(src)
        this.verso.play().catch(err => {
            err
        });
    }


    /**
     * Funzione per ottenere il tasso di genere del Pokémon in percentuale
     * @param genderRate  Tasso di genere del Pokémon
     * @returns  Tasso di genere in percentuale
     */
    getGenderRatio(genderRate: number) {
        if (genderRate === -1) {
            return { male: null, female: null, text: "Nessuno" };
        }
        const female = (genderRate / 8) * 100;
        const male = 100 - female;
        return { male, female, text: `${female}% femmina / ${male}% maschio` };
    }


    /**
     * Determina la forma del Pokémon nella catena evolutiva.
     * @chain La catena evolutiva del Pokémon.
     * @pokemonName Il nome del Pokémon da verificare.
     * @returns "Forma base", "Stadio evolutivo" o "Forma finale"
    */
    getFormaPokemon(chain: any, pokemonName: string): string {
        // Se è la forma base (prima specie della catena)
        if (chain?.species.name === pokemonName) {
            if (!chain.evolves_to || chain.evolves_to.length === 0) {
                return "Forma base e finale"; // Pokémon che non evolve
            }
            return "Forma base";
        }

        // Funzione ricorsiva per trovare la posizione
        function cercaForma(subChain: any, name: string): string | null {
            for (const evo of subChain.evolves_to) {
                if (evo.species.name === name) {
                    if (!evo.evolves_to || evo.evolves_to.length === 0) {
                        return "Forma finale";
                    }
                    return "Stadio evolutivo";
                }
                const result = cercaForma(evo, name);
                if (result) return result;
            }
            return null;
        }

        return cercaForma(chain, pokemonName) ?? "Sconosciuta";
    }


    /**
     * Restituisce le evoluzioni raggruppate per stage:
     * Observable che emette: [ [stage1Items], [stage2Items], ... ]
     */
    private getEvolutionData(urlOrChain: string | { url?: string } | any): Observable<any[][]> {
        // Normalizza input: otteniamo un Observable con l’oggetto "chain" completo
        const chainData$: Observable<any> = ((): Observable<any> => {
            if (typeof urlOrChain === 'string') return this.api.getEvolutionChain(urlOrChain);
            if (urlOrChain && typeof urlOrChain === 'object' && urlOrChain.url) return this.api.getEvolutionChain(urlOrChain.url);
            return of(urlOrChain); // già oggetto chain completo
        })();
        const url_item_sprite: string = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/'

        return chainData$.pipe(
            map(chainData => chainData?.chain ?? chainData),
            switchMap((chainObj: any) => {
                if (!chainObj || !chainObj.species) return of([] as any[][]);
                const evolObs: Observable<any>[] = [];
                const traverse = (node: any, stage: number, parentName: string | null = null) => {
                    const species = node?.species;
                    if (!species) return;
                    let speciesName = species.name ?? (species.url ? species.url.split('/').filter(Boolean).pop() : null);
                    // Unisco tutti i dettagli di evoluzione per rimuovere dupilcati
                    const detailsArr = node.evolution_details ?? [];
                    const combinedDetail: any = {};
                    detailsArr.forEach((d: any) => {
                        if (d.min_level) combinedDetail.min_level = d.min_level;
                        if (d.min_happiness) combinedDetail.min_happiness = d.min_happiness;
                        if (d.min_affection) combinedDetail.min_affection = d.min_affection;
                        if (d.min_beauty) combinedDetail.min_beauty = d.min_beauty;
                        if (d.time_of_day) combinedDetail.time_of_day = d.time_of_day;
                        if (d.known_move) combinedDetail.known_move = d.known_move;
                        if (d.known_move_type) combinedDetail.known_move_type = d.known_move_type;
                        if (d.item) combinedDetail.item = d.item;
                        if (d.held_item) combinedDetail.held_item = d.held_item;
                        if (d.trigger.name === 'trade') combinedDetail.scambio = true
                        if (d.turn_upside_down) combinedDetail.turn_upside_down = d.turn_upside_down
                        if (d.trigger.name === 'spin') combinedDetail.spin = true
                        if (d.party_type) combinedDetail.party_type = d.party_type
                        if (d.party_species) combinedDetail.party_species = d.party_species
                        if (d.trigger.name === 'shed') combinedDetail.shed = true
                        if (d.relative_physical_stats) combinedDetail.relative_physical_stats = d.relative_physical_stats
                    });
                    // genero le condizioni
                    const conditions: string = this.UT.mapConditions(combinedDetail, speciesName) ?? '';
                    // Observable dei dettagli del Pokémon
                    const itemSprite = detailsArr.find((d: any) => d.trigger?.name?.toLowerCase().trim() === 'use-item' && d.item?.name)
                        ? `${url_item_sprite}${detailsArr.find((d: any) => d.trigger?.name?.toLowerCase().trim() === 'use-item')!.item.name}.png`
                        : null;
                    const heldItemSprite = detailsArr.find((d: any) =>
                        d.held_item?.name?.toLowerCase().trim() !== null && d.held_item?.name)
                        ? `${url_item_sprite}${detailsArr.find((d: any) => d.held_item?.name?.toLowerCase().trim() !== null)!.held_item.name}.png`
                        : null;
                    evolObs.push(
                        // In base all'endpoint delle v2/pokemon delle pokeApi devo usare urshifu-single-strike
                        this.api.getPokemonDetails(this.cambioNomePokemon(speciesName)).pipe(
                            map((p: any) => ({
                                name: speciesName,
                                tipo1: this.TR.TraduciTipo(p.types[0].type.name),
                                tipo2: this.TR.TraduciTipo(p.types[1]?.type.name) ?? null,
                                stage, // numero dello stage evolutivo 
                                parent: parentName, // nome del genitore
                                item_sprite: itemSprite, // sprite dell'item da utilizzre
                                held_item_sprite: heldItemSprite, // sprite dell'item da tenere
                                sprite: p.sprites?.other?.home?.front_default
                                    ?? p.sprites?.other?.['official-artwork']?.front_default
                                    ?? p.sprites?.front_default,
                                conditions, // stringa contenente le definizioni della/e condizione/i per l'evoluzione
                                raw_details: detailsArr // prendo l'array grezzo dalle pokeApi
                            })),
                        )
                    );
                    // Ricorsione sui figli
                    (node.evolves_to ?? []).forEach((child: any) => traverse(child, stage + 1, speciesName));
                };
                // Avvio dalla root della chain
                traverse(chainObj, 1);
                // Eseguiamo tutte le chiamate e raggruppiamo per stage
                return forkJoin(evolObs.length ? evolObs : [of([])]).pipe(
                    map((evols: any[]) => {
                        const mapStages = new Map<number, any[]>();
                        evols.forEach(e => {
                            const s = e.stage ?? 1;
                            if (!mapStages.has(s)) mapStages.set(s, []);
                            mapStages.get(s)!.push(e);
                        });
                        const ordered = Array.from(mapStages.keys()).sort((a, b) => a - b);
                        return ordered.map(k => mapStages.get(k)!);
                    })
                );
            })
        );
    }
}
