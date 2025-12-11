import { Component, Input, OnInit } from '@angular/core';
import { ICard } from '../../../interface/ICard.interface';

@Component({
    selector: 'card-pokemon',
    standalone: false,
    templateUrl: './card-pokemon.component.html',
    styleUrl: './card-pokemon.component.scss'
})
export class CardPokemonComponent{
    @Input('pokemon') pokemon!: ICard
    colori: { [key: string]: string } = {
        Normale: '#A8A77A',
        Fuoco: '#EE8130',
        Acqua: '#6390F0',
        Elettrico: '#F7D02C',
        Erba: '#7AC74C',
        Ghiaccio: '#96D9D6',
        Lotta: '#C22E28',
        Veleno: '#A33EA1',
        Terra: '#E2BF65',
        Volante: '#A98FF3',
        Psico: '#F95587',
        Coleottero: '#A6B91A',
        Roccia: '#B6A136',
        Spettro: '#735797',
        Drago: '#6F35FC',
        Buio: '#705746',
        Acciaio: '#B7B7CE',
        Folletto: '#D685AD',
    };
    getPokemonBackground(pokemon: ICard) {
        const c1 = this.colori[pokemon.tipo1] ?? '#999';
        const c2 = pokemon.tipo2
            ? this.colori[pokemon.tipo2] ?? '#777'
            : c1;

        return {
            'background-image': `linear-gradient(180deg, ${c1}40 0%, ${c2}80 100%)`,
            'background-blend-mode': 'overlay'
        };  
    }
}

