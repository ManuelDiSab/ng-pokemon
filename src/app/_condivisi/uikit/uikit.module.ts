import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPokemonComponent } from '../componenti/card-pokemon/card-pokemon.component';
import { RouterModule } from '@angular/router';
import { FiltroPokemonComponent } from '../componenti/filtro-pokemon/filtro-pokemon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from '../componenti/search-bar/search-bar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionComponent, AccordionItem } from '../componenti/accordion/accordion.component';

const COMPONENTI = [CardPokemonComponent, FiltroPokemonComponent, SearchBarComponent,
  AccordionComponent
]

@NgModule({
  declarations: [
    ...COMPONENTI,
    AccordionItem
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,

  ],
  exports: [
    ...COMPONENTI
  ]
})
export class UikitModule { }
