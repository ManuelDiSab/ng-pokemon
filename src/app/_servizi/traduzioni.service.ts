import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TraduzioniService {
    /**
     * All'interno di questo file verranno scritte la maggior parte 
     * dei map per le traduzioni per la pagina   
    */
    constructor() { }
    timeMap: { [key: string]: string } = { day: 'giorno', night: 'notte' };


    /**
     * Traduce il tipo pokemon da inglese a italiano e viceversa
     * @returns string il tipo tradotto in italiano
     */
    TraduciTipo(tipo_en: string | null = null, tipo_it: string | null = null) {
        if (tipo_en) return this.map_tipi[tipo_en] ?? undefined;
        if (tipo_it) return this.map_tipi_ita[tipo_it] ?? undefined;
        return '';
    }

    /**
     * Map per i tipi da italiano ad inglese
     */
    public map_tipi_ita: { [key: string]: string } = {
        Erba: 'grass', Fuoco: 'fire', Acqua: 'water', Elettrico: 'electric', Psico: 'psychic', Coleottero: 'bug',
        Normale: 'normal', Spettro: 'ghost', Ghiaccio: 'ice', Drago: 'dragon', Buio: 'dark', Folletto: 'fairy',
        Lotta: 'fighting', Volante: 'flying', Veleno: 'poison', Roccia: 'rock', Acciaio: 'steel', Terra: 'ground', Ombra: 'shadow'
    }

    /**
     * Map per i tipi da inglese ad italiano
     */
    public map_tipi: { [key: string]: string } = {
        grass: 'Erba', fire: 'Fuoco', water: 'Acqua', electric: 'Elettrico', psychic: 'Psico', bug: 'Coleottero',
        normal: 'Normale', ghost: 'Spettro', ice: 'Ghiaccio', dragon: 'Drago', dark: 'Buio', fairy: 'Folletto',
        fighting: 'Lotta', flying: 'Volante', poison: 'Veleno', rock: 'Roccia', steel: 'Acciaio', ground: 'Terra', shadow: 'Ombra'
    }

    /**
     * Map per le generazioni da inglese ad italiano
     */
    public map_gen: { [key: string]: string } = {
        "generation-i": 'prima generazione', "generation-ii": 'seconda generazione', "generation-iii": 'terza generazione', "generation-iv": 'quarta generazione',
        "generation-v": 'quinta generazione', "generation-vi": 'sesta generazione', "generation-vii": 'settima generazione',
        "generation-viii": 'ottava generazione', "generation-ix": 'nona generazione'

    }

    /**
     * Map per i nomi delle statistiche da inglese a italiano
     */
    public map_stats_ita: { [key: string]: string } = {
        hp: 'PS', attack: 'Attacco', defense: 'Difesa', 'special-attack': 'Attacco Speciale', 'special-defense': 'Difesa Speciale', speed: 'Velocità'
    }

    
    /**
     * Map per la traduzione degli strumenti da inglese ad italiano
     * Uso questo map semplicemente per non appesantire ulteriormente il tutto 
     * con l'ennesima chiamata alle PokeApi 🙃
     */
    public map_strumenti_evolutivi: { [key: string]: string } = {
        // Pietre evolutive
        'moon-stone': 'Pietralunare', 'water-stone': 'Pietraidrica', 'fire-stone': 'Pietrafocaia', 'thunder-stone': 'Pietratuono',
        'leaf-stone': 'Pietrafoglia', 'sun-stone': 'Pietrasolare', 'shiny-stone': 'Pietrabrillo', 'dusk-stone': 'Neropietra',
        'dawn-stone': 'Pietralbore', 'ice-stone': 'Pietragelo', 'oval-stone': 'Pietraovale',
        // Strumenti da tenere 
        'kings-rock': 'Roccia di Re', 'metal-coat': 'Metalcoperta', 'dubious-disc': 'Dubbiodisco', 'up-grade': 'Up-Grade',
        'deep-sea-tooth': 'Denteabissi', 'deep-sea-scale': 'Squamabissi', 'prism-scale': 'Squama bella', 'dragon-scale': 'Squama Drago',
        'tart-apple': 'Aspropomo', 'sweet-apple': 'Dolcepomo', 'syrupy-apple': 'Sciroppomo', 'portector': 'Copertura',
        'razor-claw': 'Affilartiglio', 'razor-fang': 'Affilodente', 'electirizer': 'Elettritore', 'magmarizer': 'Magmatore',
        'reaper-cloth': 'Terrorpanno', 'sachet': 'Bustina aromi', 'whipped-cream': 'Dolcespuma', 'auspicious-armor': 'Armatura fausta',
        'malicious-armor': 'Armatura infausta', 'black-augurite': 'Augite nera', 'chipped-pot': 'Teiera crepata', 'cracked-pot': 'Teiera rotta',
        'masterpiece-teacup': 'Tazza eccezionale', 'unremarkable-teacup': 'Tazza dozzinale', 'scroll-of-darkness': 'Rotolo del buio',
        'scroll-of-waters': "Rotolo dell'acqua", 'peat-block': 'Blocco di torba', 'metal-alloy': 'Metallo composito',
        'galarica-cuff': "Filo dell'unione", 'galarica-wreath': 'Corona galarnoce', 'strawberry-sweet': 'Bonbonfragola',
        'love-sweet': 'Bonboncuore', 'berry-sweet': 'Bonbonbosco', 'clover-sweet': 'Bonbonfoglia', 'flower-sweet': 'Bonbonfiore',
        'star-sweet': 'Bonbonstella', 'ribbon-sweet': 'Bonbonfiocco',
    }
}
