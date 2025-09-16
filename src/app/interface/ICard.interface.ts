import { stats } from "../_tipi/Stats.type"

export interface ICard {
    id:number
    idGen:number
    nome:string
    sprite:string
    is_legendary:boolean
    is_mythical:boolean 
    tipo1:string
    tipo2?:string | null    
    stats?:stats[]
}