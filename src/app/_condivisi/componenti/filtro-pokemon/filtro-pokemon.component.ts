import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { UtilityService } from '../../../_servizi/utility.service';
import { ApiService } from '../../../_servizi/api.service';
import { map, Observable } from 'rxjs';
import { IGen } from '../../../interface/IGen.interface';
import { HttpParams } from '@angular/common/http';
import { TraduzioniService } from '../../../_servizi/traduzioni.service'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
@Component({
    selector: 'filtro-pokemon',
    standalone: false,
    templateUrl: './filtro-pokemon.component.html',
    styleUrl: './filtro-pokemon.component.scss'
})
export class FiltroPokemonComponent implements OnInit {
    @Output() FiltriApllicati = new EventEmitter<HttpParams>()
    @ViewChild('filter') filter!: ElementRef
    filtroForm: FormGroup
    tipi$: Observable<any>
    generazioni$: Observable<any[]>
    // Definisci le opzioni di ordinamento per l'HTML
    opzioniOrdinamento = [
        { value: 'nome-asc', label: 'Nome (A-Z)' },
        { value: 'nome-desc', label: 'Nome (Z-A)' },
        { value: 'id-asc', label: 'ID (Crescente)' },
        { value: 'id-desc', label: 'ID (Decrescente)' },
    ];

    opzioniRarita = [
        { formControlName: '', label: 'Tutti' },
        { formControlName: 'is_legendary', label: 'Solo leggendari' },
        { formControlName: 'is_mythical', label: 'Solo mitici' }
    ]
    filtro_aperto: boolean = false
    constructor(private UT: UtilityService, private api: ApiService, private TR: TraduzioniService,
        private fb: FormBuilder, private renderer: Renderer2) {
        this.filtroForm = this.fb.group({
            // is_legendary: [false],
            // is_mythical: [false],
            rarita: [''],
            generazione: [''],
            tipo: this.fb.array([]),
            ordinamento: ['id-asc']
        })

        // Stream Generazioni 
        this.generazioni$ = this.api.getGenerazioni().pipe(
            map((res: any) => res.data.map((g: IGen) => ({
                nome: g.nome.replace('Generazione', ''),
                idGen: g.idGen
            })))
        );

        // Stream Tipi 
        this.tipi$ = this.api.getTipi().pipe(
            map((res: any) => res.data.map((t: any) => this.TR.TraduciTipo(t.nome)))
        );
    }

    ngOnInit(): void { }
    getStyle(tipo: string, selezionato: boolean) {
        const coloreBase = this.UT.colori[tipo];
        if (selezionato) {
            return {
                'background-color': coloreBase,
                'color': '#fff', // Assumiamo testo bianco su sfondo colorato
                'border': `1px solid ${coloreBase}`,
                'box-shadow': `0 0 10px ${coloreBase}80` // Glow effect
            };
        } else {
            return {
                'background-color': 'transparent', // O var(--navbar-bg)
                'color': coloreBase,
                'border': `2px solid ${coloreBase}`
            };
        }
    }
    /**
     * Funzione per la gestione dei tipi
     * @param tipo string
     */
    toggleTipo(tipo: string) {
        const TypesArray = this.filtroForm.get('tipo') as FormArray
        const index = TypesArray.controls.findIndex(x => x.value === tipo)
        if (index === -1) {
            // se non ci sta, lo aggiungo (solo se sono meno di 2)
            if (TypesArray.length < 2) {
                TypesArray.push(new FormControl(tipo))
            }
        } else {
            //Se già c'è lo rimuovo
            TypesArray.removeAt(index)
        }
    }
    /**
     * Controllo se un tip oè selezionato ( per l'HTML)
     * @param tipo string
     */
    isTipoSelected(tipo: string): boolean {
        const typeArray = this.filtroForm.get('tipo') as FormArray
        return typeArray.controls.some(t => t.value === tipo)
    }

    toggleGen(gen: number) {
        this.filtroForm.get('generazione')?.setValue(gen.toString())
    }

    isGenSelected(gen: number): boolean {
        return gen.toString() === this.filtroForm.get('generazione')?.value
    }

    /**
     *  Al premere del pulsante per applicare i filtri emetto un evento 
     * per far sapere al componente padre di fare la ricerca
    */
    ApplicaFiltri() {
        let params = new HttpParams()
        const formVal = this.filtroForm.value
        const arrOrder = formVal.ordinamento.split('-') // prendo il valore del form e uso split per accedere ai due valori separati
        const sort = arrOrder[0]
        const order = arrOrder[1]
        //Aggiungo i param solo se true o presenti
        if (this.filtroForm.get('rarita')?.value === 'is_legendary') {
            params = params.set('is_legendary', '1');
        } else if (this.filtroForm.get('rarita')?.value === 'is_mythical') {
            params = params.set('is_mythical', '1');
        }
        if (formVal.generazione) params = params.set('generazione', formVal.generazione);
        if (formVal.ordinamento) params = params.set('order', order).set('sort', sort);
        // Gestione array tipi: aggiunge param multipli (es: types=fire&types=water)
        const typesArray = this.filtroForm.get('tipo') as FormArray;
        typesArray.controls.forEach(ctrl => {
            params = params.append('tipo', ctrl.value);
        });
        this.FiltriApllicati.emit(params)
        this.filtro_aperto = false
        console.log(params.toString())
    }

    /**
     * Funzione per assegnare il colore di background in base al tipo
     * @param tipo tipo pokemon
     * @returns 
     */
    getBackground(tipo: string) {
        const colore = this.UT.colori[tipo];
        return { 'border': `2px solid ${colore}`, 'color': colore };
    }


    // Resetto i filtri con questa funzione
    resetFiltri() {
        this.filtroForm.reset({
            is_legendary: false,
            is_mythical: false,
            generazione: '1',
            ordinamento: 'id-asc'
        });
        (this.filtroForm.get('tipo') as FormArray).clear(); // Svuoto l'array 'dei tipi
    }
    /**
     * Funzione per aprire o chiudere il filtro al clic del button
     */
    apri_filtro() {
        this.filtro_aperto = !this.filtro_aperto
        this.renderer.addClass(document.body, 'no-scroll');
    }
    // Funzione per chiudere se si clicca fuori (usata dalla direttiva o overlay)
    chiudiFiltro() {
        this.filtro_aperto = false;
        this.renderer.removeClass(document.body, 'no-scroll'); // Sblocca lo scroll
    }
    @HostListener('window:click', ['$event'])
    onClickOutsideMenu(e: Event) {
        if (this.filtro_aperto) {
            const clickInside = this.filter?.nativeElement.contains(e?.target)
            if (!clickInside) {
                this.filtro_aperto = false
            }
        }
    }


}
