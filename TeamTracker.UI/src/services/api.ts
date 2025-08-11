import type { Team } from '../types/team';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = await res.json();
  setTokens(data.access, refresh); // reuse same refresh token
  return true;
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const retryHeaders = {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      };
      res = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  return res;
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  setTokens(data.access, data.refresh);
  return data;
}

export async function signupUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  return loginUser(username, password); // Auto-login
}

export async function getTeams(): Promise<Team[]> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/`);
  if (!res.ok) throw new Error('Failed to fetch teams');
  return res.json();
}

export async function getTeamById(id: string): Promise<Team> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/${id}/`);
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

export async function createTeam(data: Team): Promise<Team> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to create team');
  }

  return res.json();
}

export async function editTeam(id: string, data: Team): Promise<Team> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update team');
  return res.json();
}

export async function deleteTeam(id: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/${id}/`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete team');
}

export async function toggleFavorite(teamId: number, isFavorite: boolean): Promise<Team> {
  const res = await fetchWithAuth(`${BASE_URL}/teams/${teamId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ isFavorite }),
  });

  if (!res.ok) throw new Error('Failed to update favorite status');
  return res.json();
}

export async function getFriends() {
  const res = await fetchWithAuth(`${BASE_URL}/friends/`);
  if (!res.ok) throw new Error('Failed to fetch friends');
  return res.json();
}

export async function addFriend(username: string) {
  const res = await fetchWithAuth(`${BASE_URL}/friends/add/`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('Failed to add friend');
  return res.json();
}

export async function removeFriend(username: string) {
  const res = await fetchWithAuth(`${BASE_URL}/friends/remove/`, {
    method: 'DELETE',
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error('Failed to remove friend');
  return res.json();
}

export async function getFriendTeams(friendId: number) {
  const res = await fetchWithAuth(`${BASE_URL}/friends/${friendId}/teams/`);
  if (!res.ok) throw new Error('Failed to fetch friend teams');
  return res.json();
}
