/**
 * API service module, ki obdeluje vse HTTP zahteve do backenda.
 * Posreduje interface in metode
 */
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Kategorija {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  kategorija?: Kategorija;
  cena: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * API service object containing methods for interacting with the backend
 */
export const api = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Check if response exists
      if (!response.data) {
        throw new Error('Invalid response format from server');
      }

      const access_token = response.data.access_token;
      
      if (!access_token) {
        throw new Error('No access token in response');
      }

      // Store token and update headers
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Create user object from login response data
      const userData = response.data.user;

      const user: User = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar || '',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        tasks: userData.tasks || []
      };
      
      return {
        token: access_token,
        user: user
      };
    } catch (error: any) {
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    try {
      // Remove avatar if empty
      const requestData: RegisterData = { ...userData };
      if (!requestData.avatar) {
        delete requestData.avatar;
      }

      const response = await axios.post(`${API_URL}/auth/register`, requestData);

      // Check if response exists and has data
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format from server');
      }

      // Get the user data from the nested response
      const responseData = response.data.data;

      if (!responseData.access_token) {
        throw new Error('No access token in response');
      }

      // Create user object from response data
      const user: User = {
        id: responseData.id,
        username: responseData.username,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        email: responseData.email,
        avatar: responseData.avatar || '',
        createdAt: responseData.createdAt,
        updatedAt: responseData.updatedAt,
        tasks: responseData.tasks || []
      };

      // Store token
      const access_token = responseData.access_token;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { user, token: access_token };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Example: Fetch tasks
  getTasks: async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },

  // Fetch tasks filtered by category
  getFilteredTasks: async (kategorijaId: number) => {
    const response = await axios.get(`${API_URL}/tasks?kategorija=${kategorijaId}`);
    return response.data;
  },

  // Fetch user tasks
  getUserTasks: async () => {
    const response = await axios.get(`${API_URL}/tasks/my-tasks`);
    return response.data;
  },

  // Fetch categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/kategorije`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Example: Fetch user profile
  getUserProfile: async () => {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: { title: string; description: string; cena: number; kategorijaId: number }) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  },

  getTask: async (taskId: number) => {
    const response = await axios.get(`${API_URL}/tasks/${taskId}`);
    return response.data;
  },

  updateTask: async (taskId: number, taskData: { title: string; description: string; cena: number; kategorijaId: number }) => {
    const response = await axios.patch(`${API_URL}/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: number) => {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    return response.data;
  }
}; 