import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DettaglioRoutingModule } from './dettaglio-routing.module';
import { DettaglioComponent } from './dettaglio.component';
import { StatisticheComponent } from './comp/statistiche/statistiche.component';
import { EvoluzioniComponent } from './comp/evoluzioni/evoluzioni.component';
import { NgbAccordionBody, NgbAccordionButton, NgbAccordionModule, NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InfoComponent } from './comp/info/info.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";
import { DebolezzeComponent } from './comp/debolezze/debolezze.component';

@NgModule({
  declarations: [
    DettaglioComponent,
    StatisticheComponent,
    EvoluzioniComponent,
    InfoComponent,
    DebolezzeComponent

  ],
  imports: [
    CommonModule,
    DettaglioRoutingModule,
    NgbAccordionModule,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbTooltip,
    NgbDropdownModule,
    UikitModule
  ]
})
export class DettaglioModule { }
