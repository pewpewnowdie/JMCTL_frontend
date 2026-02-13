// Admin API Client for backend communication

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
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

export const adminApi = {
  // Projects
  projects: {
    create: async (project_key: string, name: string) => {
      return fetchWithAuth('/admin/projects', {
        method: 'POST',
        body: JSON.stringify({ project_key, name }),
      });
    },

    getAll: async () => {
      return fetchWithAuth('/admin/projects');
    },

    getUsers: async (project_key: string) => {
      return fetchWithAuth(`/admin/projects/${project_key}/users`);
    },

    addUser: async (project_key: string, username: string) => {
      return fetchWithAuth('/admin/projects/users', {
        method: 'POST',
        body: JSON.stringify({ project_key, username }),
      });
    },

    removeUser: async (project_key: string, username: string) => {
      return fetchWithAuth('/admin/projects/users', {
        method: 'DELETE',
        body: JSON.stringify({ project_key, username }),
      });
    },
  },

  // Releases
  releases: {
    create: async (project_key: string, name: string) => {
      return fetchWithAuth('/admin/releases', {
        method: 'POST',
        body: JSON.stringify({ project_key, name }),
      });
    },

    getAll: async () => {
      return fetchWithAuth('/admin/releases');
    },

    getRuns: async (release_id: string) => {
      return fetchWithAuth(`/admin/releases/${release_id}`);
    },
  },

  // Users
  users: {
    getAll: async () => {
      return fetchWithAuth('/admin/users');
    },
  },
};

export { ApiError };