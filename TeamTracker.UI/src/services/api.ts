import type { Team } from '../types/team';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createTeam(data: Team): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/teams/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create team');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

export async function getTeams(): Promise<Team[]> {
    try {
      const response = await fetch(`${BASE_URL}/teams/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
}