import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokedexRoutingModule } from './pokedex-routing.module';
import { PokedexComponent } from './pokedex.component';
import { UikitModule } from '../../_condivisi/uikit/uikit.module';
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    PokedexComponent
  ],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    UikitModule,
    FormsModule
  ]
})
export class PokedexModule { }
