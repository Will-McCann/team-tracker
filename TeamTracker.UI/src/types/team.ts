import type { Pokemon } from './pokemon'

export interface Team {
    id?: number;
    name: string;
    generation: string;
    description?: string;
    pokemon: Pokemon[];
  }