import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../../_servizi/api.service';
import { UtilityService } from '../../../../_servizi/utility.service';
import { ITipo } from '../../../../interface/ITipo.interface';
import { stats } from '../../../../_tipi/Stats.type';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'statistiche',
    standalone: false,
    templateUrl: './statistiche.component.html',
    styleUrl: './statistiche.component.scss'
})
export class StatisticheComponent {
    @Input() stats: stats[] = [];
    url1: string = ''
    url2: string = ''
    constructor(private api: ApiService) {
    }

    /**
     * Calcola e restituisce la somma delle statistiche base.
     * @param statistiche L'array di oggetti stat.
     * @returns Il totale numerico.
     */
    calcolaStatsTotali(statistiche: stats[]): number {
        if (statistiche != null) { return statistiche.reduce((totale, stat) => totale + stat.base_stat, 0); }
        else return 0
    }

    getStatColor(width: number) {
        switch (true) {
            case width <= 29:
                return '#cb1414ff'
                break
            case width <= 59:
                return '#ff6d04ff'
                break
            case width <= 89:
                return '#ffdd57'
                break
            case width <= 119:
                return '#a0e515'
                break
            case width <= 149:
                return '#23cd5e'
                break
            case width <= 255:
                return '#5E74FB'
                break
            default:
                return '#5E74FB'
        }
    }

    getColorStat(stat_base: number): { [key: string]: string } {
        const width = (stat_base / 255) * 100 + 15
        return {
            // 'background-color':this.colori_stat[stat]
            'background-color': this.getStatColor(stat_base)!, 'width': `${width}%`
        }
    }

    // nature: 1.1 (favorevole), 1.0 (neutra), 0.9 (sfavorevole)
    statNonHPMaxAt100(base: number, nature = 1.1): number {
        const pre = 2 * base + 99; // IV=31, EV=252
        return Math.floor(pre * nature);
    }

    statNonHPMinAt100(base: number, nature = 0.9): number {
        const pre = 2 * base + 5;  // IV=0, EV=0
        return Math.floor(pre * nature);
    }

    hpMaxAt100(base: number): number {
        // IV=31, EV=252
        if (base === 1) return 1;
        return 2 * base + 204;
    }

    hpMinAt100(base: number): number {
        if (base === 1) return 1;
        return 2 * base + 110;
    }


}
