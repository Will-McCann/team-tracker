import type { Pokemon } from './pokemon'

export interface Team {
    name: string;
    generation: string;
    description?: string;
    pokemon: Pokemon[];
  }