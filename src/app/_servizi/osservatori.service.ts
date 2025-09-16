import { Injectable } from '@angular/core';
import { ICard } from '../interface/ICard.interface';
import { UtilityService } from './utility.service';
import { TraduzioniService } from './traduzioni.service';

@Injectable({
    providedIn: 'root'
})
export class OsservatoriService {

    constructor(private TR:TraduzioniService) { }

    public osservatorePokemon(arr_pokemon: ICard[], url_sprite: string) {
        return {
            next: (rit: any) => {
                const elem = rit.data
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
                    }
                    arr_pokemon.push(tmp)
                }
            }, error: (err: any) => {
                console.log('error:', err)
            }, complete: () => {
                console.log('completato')
            }
        }
    }
}

