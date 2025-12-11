import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokedexRoutingModule } from './pokedex-routing.module';
import { PokedexComponent } from './pokedex.component';
import { UikitModule } from '../../_condivisi/uikit/uikit.module';

@NgModule({
  declarations: [
    PokedexComponent,
  ],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    UikitModule,
  ]
})
export class PokedexModule { }
