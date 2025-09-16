import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UtilityService } from '../../../../_servizi/utility.service';
import { TraduzioniService } from '../../../../_servizi/traduzioni.service';

@Component({
    selector: 'evoluzioni',
    standalone: false,
    templateUrl: './evoluzioni.component.html',
    styleUrl: './evoluzioni.component.scss'
})
export class EvoluzioniComponent {
    colori: { [key: string]: string }
    traduzione_tipi: { [key: string]: string }
    @Input() evoluzioni: any

    constructor(private UT: UtilityService, private TR: TraduzioniService) {
        this.colori = this.UT.colori
        this.traduzione_tipi = this.TR.map_tipi
    }

    /**
     * 
     */
    getChildrenByDepth(depth: number, parentName: string) {
        const next = this.evoluzioni?.[depth + 1] ?? [];
        return next.filter((c:any) => c.parent === parentName);
    }


}
