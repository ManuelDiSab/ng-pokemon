import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITipo } from '../../../../interface/ITipo.interface';
import { UtilityService } from '../../../../_servizi/utility.service';
import { ApiService } from '../../../../_servizi/api.service';
import { forkJoin } from 'rxjs';
import { TraduzioniService } from '../../../../_servizi/traduzioni.service';

@Component({
    selector: 'debolezze',
    standalone: false,
    templateUrl: './debolezze.component.html',
    styleUrl: './debolezze.component.scss'
})
export class DebolezzeComponent implements OnChanges {
    @Input() type: string[] = []
    tipo: ITipo | null = null
    tipo2: ITipo | null = null
    tipoFinale: ITipo | null = null
    colori: { [key: string]: string }
    constructor(private UT: UtilityService,private TR:TraduzioniService, private api: ApiService) {
        this.colori = this.UT.colori
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['type'] && this.type !== null && this.type.length > 0) {
            this.caricaTipi(this.type);
            const finale = this.calcoloRelazioniTipi(this.tipo!, this.tipo2!);
        }
    }

    private caricaTipi(urls: string[]) {
        // Array di chiamate HTTP
        const chiamate = urls.map(url => this.api.getGenerico(url));

        forkJoin(chiamate).subscribe(risultati => {
            const traduciArray = (arr: any[]) => arr.map(e => this.TR.TraduciTipo(e.name));

            // Costruisci ITipo per ogni tipo caricato
            const tipiCaricati: ITipo[] = risultati.map((rit, index) => {
                const damage = rit.damage_relations;

                const debolezze = traduciArray(damage.double_damage_from);
                const efficace = traduciArray(damage.double_damage_to);
                const resistenze = traduciArray(damage.half_damage_from);
                const pocoEfficace = traduciArray(damage.half_damage_to);
                const inefficace = traduciArray(damage.no_damage_to);
                const immune = damage.no_damage_from.map((e: any) => this.TR.TraduciTipo(e.name) ?? 'Nessuno');

                const tuttiEsclusi = new Set([...debolezze, ...efficace, ...resistenze, ...pocoEfficace, ...inefficace, ...immune]);

                return {
                    nome: [this.TR.TraduciTipo(urls[index].split('/').pop())!],
                    debolezze,
                    efficace,
                    resistenze,
                    poco_efficace: pocoEfficace,
                    inefficace,
                    immune,
                    normale: this.UT.tipi.filter(tipo => !tuttiEsclusi.has(tipo))
                };
            });

            // Popola this.tipo e this.tipo2
            this.tipo = tipiCaricati[0] || null;
            this.tipo2 = tipiCaricati[1] || null;

            // Ora calcoliamo l'ITipo finale combinato
            const tipoFinale = this.calcoloRelazioniTipi(this.tipo!, this.tipo2!);

            // Puoi salvarlo in una proprietà del componente se vuoi usarlo in template
            this.tipoFinale = tipoFinale;
        });
    }


    calcoloRelazioniTipi(tipo1: ITipo, tipo2?: ITipo): ITipo {
        const debolezze: string[] = [];
        const doppieDebolezze: string[] = [];
        const resistenze: string[] = [];
        const doppieResistenze: string[] = [];
        const immune: string[] = [];
        const normale: string[] = [];

        for (const difensore of this.UT.tipi) {
            let countDebole = 0;
            let countResist = 0;
            let isImmune = false;

            [tipo1, tipo2].forEach(tipo => {
                if (!tipo) return;

                if ((tipo.debolezze ?? []).includes(difensore)) countDebole++;
                if ((tipo.resistenze ?? []).includes(difensore)) countResist++;
                if ((tipo.immune ?? []).includes(difensore)) isImmune = true;
            });

            let multiplier = 1;
            if (isImmune) multiplier = 0;
            else multiplier *= Math.pow(2, countDebole) * Math.pow(0.5, countResist);

            // Smistamento nelle categorie
            if (multiplier === 0) immune.push(difensore);
            else if (multiplier === 0.25) doppieResistenze.push(difensore);
            else if (multiplier === 0.5) resistenze.push(difensore);
            else if (multiplier === 2) debolezze.push(difensore);
            else if (multiplier === 4) doppieDebolezze.push(difensore);
            else normale.push(difensore);
        }

        return {
            nome: [...(tipo1?.nome ?? []), ...(tipo2?.nome ?? [])],
            debolezze,
            doppieDebolezze,
            resistenze,
            doppieResistenze,
            immune,
            normale,
            efficace: [],
            poco_efficace: [],
            inefficace: []
        };
    }



}
