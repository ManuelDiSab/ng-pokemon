import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { PokemonService } from '../../../_servizi/pokemon.service';
import { UtilityService } from '../../../_servizi/utility.service';
import { HttpParams } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
type version_type = 'normal' | 'compact' | 'modal'

@Component({
    selector: 'search-bar',
    standalone: false,
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
    suggestioni: string[] = []
    ulOpen: boolean = false
    query: HttpParams = new HttpParams()
    private modalService = inject(NgbModal)
    @Input('version') version!: version_type
    @ViewChild('result-list') resultList!: ElementRef
    @ViewChild('input') input!: ElementRef
    InputRicerca$ = new Subject<string>()
    constructor(private PS: PokemonService, private UT: UtilityService, private router: Router) {

    }
    ngOnInit(): void {
        this.PS.caricaNomiPokemon()
        this.InputRicerca$.pipe(
            debounceTime(200),
            distinctUntilChanged()
        ).subscribe(term => {
            this.suggestioni = this.PS.ricercaPokemon(term)
        })

    }


    @HostListener('document:click', ['$event'])
    SUlClickFuori(event: MouseEvent) {
        const clickUl = this.resultList?.nativeElement.contains(event.target)
        const clickIniput = this.input?.nativeElement.contains(event.target)
        if (!clickIniput && !clickUl) {
            this.ulOpen = false
        }

    }


    @Output() ricerca = new EventEmitter<HttpParams>()
    onSubmit(ricerca: string): void {
        this.query = this.UT.aggiungiQuery('nome', ricerca);

        // converto HttpParams in oggetto semplice
        const queryObj: { [key: string]: string } = {};
        this.query.keys().forEach(key => {
            queryObj[key] = this.query.get(key)!;
        });

        // navigo verso Pokedex con queryParams
        this.router.navigate(['/pokedex'], { queryParams: queryObj });
        
        this.ulOpen = false;
    }
    onSearch(input: string) {
        this.InputRicerca$.next(input)
    }

    /**
     * Funzione per apire la modal
     * @param content 
     */
    open(content: TemplateRef<any>) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                // Caso in cui la modal viene CHIUSA normalmente con modal.close('qualcosa')
            },
            (reason) => {
                // Caso in cui la modal viene DISMISSATA (ESC, click fuori, modal.dismiss('qualcosa'))
                this.suggestioni = [];
            }
        )
    }



}
