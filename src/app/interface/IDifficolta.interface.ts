import { difficolta } from "../_tipi/Difficolta.type";

export interface IDifficoltàPreset {
    viteTotali: number
    secondiIniziali: number
    tempoCritico: number
}

export const difficultyPresets: Record<difficolta, IDifficoltàPreset> = {
    facile: { viteTotali: 6, secondiIniziali: 20, tempoCritico: 7 },
    media: { viteTotali: 5, secondiIniziali: 15, tempoCritico: 5 },
    difficile: { viteTotali: 3, secondiIniziali: 10, tempoCritico: 3 },
};