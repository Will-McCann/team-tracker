import type { Team } from '../types/team';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Login failed');
  }

  const tokens = await response.json();
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
  return tokens;
}

export async function signupUser(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Signup failed');
  }

  // Auto-login after signup
  return loginUser(username, password);
}

export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${BASE_URL}/teams/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch teams');
  return await response.json();
}

export async function createTeam(data: Team): Promise<any> {
  const response = await fetch(`${BASE_URL}/teams/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create team');
  }

  return await response.json();
}

export async function getTeamById(id: string): Promise<Team> {
  const response = await fetch(`${BASE_URL}/teams/${id}/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch team');
  return response.json();
}

export async function editTeam(id: string, data: Team): Promise<any> {
  const response = await fetch(`${BASE_URL}/teams/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update team');
  return response.json();
}

export async function deleteTeam(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/teams/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete team');
  }
}

export async function toggleFavorite(teamId: number, isFavorite: boolean) {
  const response = await fetch(`${BASE_URL}/teams/${teamId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isFavorite }),
  });

  if (!response.ok) {
    throw new Error('Failed to update favorite status');
  }

  return await response.json();
}
