import { Injectable } from '@angular/core';
import { query } from '../_tipi/Query.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TraduzioniService } from './traduzioni.service';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    query_string = new HttpParams
    arr_tipi: string[] = []
    constructor(private http: HttpClient, private TR: TraduzioniService) {
    }

    readonly sostituzioni: Record<string, string> = {
        'nidoran-m': 'nidoran', 'nidoran-f': 'nidoran', 'mr-mime': 'mr.mime', 'mr.rime': 'mr.rime', 'mime-jr': 'mime jr',
        'urshifu-single-strie': 'urshifu', 'urshifu-rapid-strike': 'urshifu', 'palafin-zero': 'palafin'
    }


    /**
     * Genera una descrizione testuale delle condizioni di evoluzione di un Pokémon.
     * Le condizioni possono includere livello, strumenti tenuti, luogo, mosse conosciute,
     * affetto, bellezza, tempo del giorno, membri del team e altri requisiti speciali.
     * Alcuni Pokémon hanno condizioni uniche (es. Tyrogue, Runerigus, Gholdengo, ecc.)
     * che vengono gestite esplicitamente.
     *
     * @param conditions Oggetto rappresentante le condizioni di evoluzione.
     * @param nome Nome del Pokémon, usato per verificare eventuali casi speciali.
     * @returns Una stringa che descrive in linguaggio naturale le condizioni di evoluzione.
     */
    public mapConditions(conditions: any, nome: string): string {
        if (!conditions || typeof conditions !== 'object') return '';
        const descrizioni: string[] = [];
        const seenKeys = new Set<string>();

        const add = (key: string, text?: string) => {
            if (text && !seenKeys.has(key)) {
                descrizioni.push(text);
                seenKeys.add(key);
            }
        };

        // Mappa condizioni comuni
        const conditionMap: Record<string, string | undefined> = {
            trade: conditions.scambio ? 'scambio' : undefined,
            min_level: conditions.min_level ? `Al livello ${conditions.min_level}` : undefined,
            min_happiness: conditions.min_happiness ? 'Con affetto alto' : undefined,
            min_affection: conditions.min_affection ? `Con legame almeno ${conditions.min_affection} cuori` : undefined,
            min_beauty: conditions.min_beauty ? 'Con bellezza alta' : undefined,
            held_item: conditions.held_item ? `tenendo ${this.TR.map_strumenti_evolutivi[conditions.held_item.name]}` : undefined,
            time_of_day: (conditions.time_of_day === 'day' || conditions.time_of_day === 'night')
                ? `(${this.TR.timeMap[conditions.time_of_day]})` : undefined,
            location: conditions.location ? `Presso ${conditions.location.name}` : undefined,
            known_move: conditions.known_move ? `Dopo aver imparato la mossa ${conditions.known_move.name}` : undefined,
            known_move_type: conditions.known_move_type ? `Dopo aver imparato una mossa di tipo ${this.TR.map_tipi[conditions.known_move_type.name]}` : undefined,
            item: conditions.item ? this.TR.map_strumenti_evolutivi[conditions.item.name] : undefined,
            spin: conditions.spin ? 'Facendo una piroetta mentre tiene un bonbon' : undefined,
            upside_down: conditions.turn_upside_down ? 'capovolgendo la console' : undefined,
            party_type: conditions.party_type ? `con un pokemon di tipo ${this.TR.map_tipi[conditions.party_type.name]} in squadra` : undefined,
            party_species: conditions.party_species ? `salendo di livello con ${conditions.party_species.name} in squadra` : undefined,
            shed: conditions.shed ? 'con spazio in squadra e almeno una pokeball nella borsa' : undefined,
        };

        // Aggiungo le condizioni mappate
        for (const [key, text] of Object.entries(conditionMap)) {
            add(key, text);
        }

        // Gestione speciale Tyrogue
        if (conditions.relative_physical_stats !== undefined) {
            switch (conditions.relative_physical_stats) {
                case -1: add('tyrogue', 'con Difesa > Attacco'); break;
                // case 0: add('tyrogue', 'con Attacco = Difesa'); break; // Non funziona (nemmeno usando Number())
                case 1: add('tyrogue', 'con Attacco > Difesa'); break;
            }
        }
        if (nome === 'hitmontop') add('tyrogue', 'con Attacco = Difesa');

        // Condizioni speciali per Pokémon specifici
        const specialCases: Record<string, string> = {
            leafeon: 'o salendo di livello presso una roccia muschio',
            glaceon: 'o salendo di livello presso un masso ghiacciato',
            probopass: 'salendo di livello presso un campo magnetico',
            magnezone: 'o salendo di livello presso un campo magnetico',
            urshifu: "mostrando uno tra rotolo del buio e rotolo dell'acqua",
            runerigus: "avendo subito almeno 49Ps di danni, passare sotto l'arco di pietra nella Conca delle sabbie",
            gholdengo: 'salendo di livello con almeno 999 monete di Gimmighoul nella borsa',
            sirfetchd: 'ottenendo tre brutti colpi nella stessa battaglia (solo farfetchd di Galar)',
            dipplin: 'Sciroppopomo',
            hydrapple: 'aumento di livello avendo appreso Grido del Drago'
        };

        if (specialCases[nome]) add(nome, specialCases[nome]);

        return descrizioni.join(' ');
    }

    public colori: { [key: string]: string } = {
        Normale: 'rgba(168, 167, 122, 1)', Fuoco: '#EE8130', Acqua: '#6390F0', Elettrico: '#F7D02C',
        Erba: '#7AC74C', Ghiaccio: '#96D9D6', Lotta: '#C22E28', Veleno: '#A33EA1',
        Terra: '#E2BF65', Volante: '#A98FF3', Psico: '#F95587', Coleottero: '#A6B91A',
        Roccia: '#B6A136', Spettro: '#735797', Drago: '#6F35FC', Buio: '#705746',
        Acciaio: '#B7B7CE', Folletto: '#D685AD',
    };

    public tipi = [
        'Erba', 'Fuoco', 'Acqua', 'Elettrico', 'Psico', 'Coleottero',
        'Normale', 'Spettro', 'Ghiaccio', 'Drago', 'Buio', 'Folletto',
        'Lotta', 'Volante', 'Veleno', 'Roccia', 'Acciaio', 'Terra'
    ]

    public cambiaNomePokemonQuiz(nome: string): string {
        return this.sostituzioni[nome] ?? nome
    }

    /**
     * Funzione per creare dinamicamente query per filtrare i pokemon
     * @param argomento argoimento della query
     * @param value Valore da aggiungere
     * @returns httpParams
     */
    aggiungiQuery(argomento: query, value: string): HttpParams {
        if (!value) return this.query_string; // evita valori vuoti

        if (argomento === 'types') {
            this.arr_tipi.push(value);
            const tipiParam = this.arr_tipi.join(',');
            this.query_string = this.query_string.set(argomento, tipiParam);
        } else {
            this.query_string = this.query_string.set(argomento, value);
        }

        return this.query_string;
    }

    getGenderRatio(genderRate: number) {
        if (genderRate === -1) {
            return { male: null, female: null, text: "Nessuno" };
        }
        const female = (genderRate / 8) * 100;
        const male = 100 - female;
        return { male, female, text: `${female}% femmina / ${male}% maschio` };
    }


    /**
     * Funzione per togliere le query dinamicamente
     * @param argomento argomento della query da togliere
     * @param value valore della query da togliere ( per le query multiple )
     * @returns HttpParams
     */
    DestroyQuery(argomento: query, value: string): HttpParams {
        if (argomento === 'types') {
            this.arr_tipi = this.arr_tipi.filter(tipo => tipo !== value);
            if (this.arr_tipi.length > 0) {
                this.query_string = this.query_string.set(argomento, this.arr_tipi.join(','));
            } else {
                this.query_string = this.query_string.delete(argomento);
            }
        } else {
            this.query_string = this.query_string.delete(argomento);
        }
        return this.query_string;
    }



}
