import type { Pokemon } from './pokemon'

export interface Team {
    id?: number;
    name: string;
    generation: string;
    description?: string;
    isFavorite: boolean;
    pokemon: Pokemon[];
  }