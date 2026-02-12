// API Client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.detail || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  auth: {
    register: async (username: string, password: string) => {
      return fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },

    login: async (username: string, password: string) => {
      const response = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      
      return response;
    },

    logout: () => {
      localStorage.removeItem('access_token');
    },

    isAuthenticated: () => {
      return !!localStorage.getItem('access_token');
    },
  },

  // Projects endpoint
  projects: {
    getAll: async () => {
      return fetchWithAuth('/projects');
    },
  },

  // Releases endpoints
  releases: {
    getByProject: async (projectKey: string) => {
      return fetchWithAuth(`/releases?project=${projectKey}`);
    },

    getRuns: async (releaseId: string) => {
      return fetchWithAuth(`/releases/${releaseId}`);
    },
  },

  // Runs endpoint
  runs: {
    getById: async (runId: string) => {
      return fetchWithAuth(`/runs/${runId}`);
    },
  },
};

export { ApiError };
