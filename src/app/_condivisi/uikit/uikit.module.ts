import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPokemonComponent } from '../componenti/card-pokemon/card-pokemon.component';
import { RouterModule } from '@angular/router';
import { FiltroPokemonComponent } from '../componenti/filtro-pokemon/filtro-pokemon.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../componenti/search-bar/search-bar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const COMPONENTI = [ CardPokemonComponent, FiltroPokemonComponent, SearchBarComponent]

@NgModule({
  declarations: [
    ...COMPONENTI
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, 
    NgbModalModule
  ],
  exports: [
    ...COMPONENTI
  ]
})
export class UikitModule { }
