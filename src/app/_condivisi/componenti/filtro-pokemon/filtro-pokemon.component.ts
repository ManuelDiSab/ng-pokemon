import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilityService } from '../../../_servizi/utility.service';
import { ApiService } from '../../../_servizi/api.service';
import { filter, map, Observable, tap } from 'rxjs';
import { IGen } from '../../../interface/IGen.interface';
import { HttpParams } from '@angular/common/http';
import { query } from '../../../_tipi/Query.type';
import { TraduzioniService } from '../../../_servizi/traduzioni.service';

@Component({
    selector: 'filtro-pokemon',
    standalone: false,
    templateUrl: './filtro-pokemon.component.html',
    styleUrl: './filtro-pokemon.component.scss'
})
export class FiltroPokemonComponent implements OnInit {

    tipi$: Observable<any>
    generazioni$: Observable<any>
    // Divido i tipi in due array per fare poi due colonne in html
    col_1_tipi: string[] = []
    col_2_tipi: string[] = []
    filtro_aperto: boolean = false
    tipi_selezionati: number = 0
    query_string: HttpParams = new HttpParams()
    generazione: string = ''
    generazioni: IGen[] = []
    constructor(private UT: UtilityService, private api: ApiService, private TR:TraduzioniService) {
        this.generazioni$ = this.api.getGenerazioni().pipe(
            map((rit: any) => rit.data.map(
                (rit2: any) => rit2.nome.replace('Generazione', '')
            ))
        )
        this.tipi$ = this.api.getTipi().pipe(
            map((rit: any) => rit.data
                .map((rit: any) => this.TR.TraduciTipo(rit.nome))
                //levo i tipi shadow e unknown che nonmi servono
                // .filter((nome: string) => nome !== 'unknown' && nome !== 'Ombra' && nome !== '')
            ),
            map((tipi: string[]) => {
                // prendo la metà come numero 
                const metà = Math.ceil(tipi.length / 2)
                return {
                    col_1: tipi.slice(0, metà),
                    col_2: tipi.slice(metà)
                }
            })
        )
    }

    ngOnInit(): void {
        this.tipi$.subscribe(
            rit => {
                this.col_1_tipi = rit.col_1
                this.col_2_tipi = rit.col_2
            }
        )
        this.generazioni$.subscribe(rit => {
            this.generazioni = rit
            console.log('gen', rit)
        })
    }

    // Al premere del pulsante per applicare i filtri emetto un evento per far sapere al componente padre di fare la ricerca
    @Output() FiltriApllicati = new EventEmitter<HttpParams>()
    ApplicaFiltri() {
        this.FiltriApllicati.emit(this.query_string)
        this.filtro_aperto = false
        console.log(this.query_string.toString())
    }

    /**
     * Funzione per assegnare il colore di background in base al tipo
     * @param tipo tipo pokemon
     * @returns 
     */
    getBackground(tipo: string) {
        return { 'background-color': `${this.UT.colori[tipo]}` }
    }


    /**
     * Funzione per aprire o chiudere il filtro al clic del button
     */
    apri_filtro() {
        this.filtro_aperto = !this.filtro_aperto
    }

    /**
     * Ricerco con una query in base al check flaggato
     * @param event 
     */
    ricerca(event: Event) {
        const check = (event.currentTarget as HTMLInputElement)
        const valore = check.checked === true ? '1' : '0'
        const name = check.name
        switch (check.checked) {
            case true:
                if (name === 'is_legendary' || name === 'is_mythical') {
                    this.query_string = this.UT.aggiungiQuery(name, valore)
                    console.log('query check', this.query_string.toString())
                }
                break
            case false:
                if (name === 'is_legendary' || name === 'is_mythical') {
                    this.query_string = this.UT.DestroyQuery(name, valore)
                    console.log('query check', this.query_string.toString())
                }
        }
    }

    /**
     * 
     * @param event 
     */
    selectGen(event: Event) {
        const valore = (event.currentTarget as HTMLSelectElement).value
        if (valore != '') {
            this.query_string = this.UT.aggiungiQuery('generazione', valore)
            console.log('query', this.query_string.toString())
            this.generazione = valore
        } else {
            this.query_string = this.UT.DestroyQuery('generazione', this.generazione)
            console.log('query', this.query_string.toString())
        }

    }

    /**
     * Funzione per selezionare e deselezionare il tipo per cui fare la ricerca
     * @param event evento da cui prendo button e value
     */
    seleziona(event: Event) {
        const button = event.currentTarget as HTMLButtonElement
        const tipo = this.TR.TraduciTipo(null, button.value)
        if (!button.classList.contains('selezionato')) {
            if (this.tipi_selezionati < 2) {
                this.tipi_selezionati++
                button.classList.add('selezionato')
                const multi = this.tipi_selezionati === 2 ? true : false
                // this.query += this.UT.creaQuery('types', tipo, multi)
                this.query_string = this.UT.aggiungiQuery('types', tipo)
                console.log('aggiungo query', this.query_string.toString())
            }
        } else {
            button.classList.remove('selezionato')
            const multi = this.tipi_selezionati === 1 ? false : true
            this.tipi_selezionati--
            this.query_string = this.UT.DestroyQuery('types', tipo)
            console.log('tolgo query', this.query_string.toString())
        }
    }
}
