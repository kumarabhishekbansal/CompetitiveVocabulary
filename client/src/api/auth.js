/**
 * Authentication API Client
 * Interacts with backend /api/v1/auth endpoints
 * Includes credentials for secure HttpOnly cookie handling
 */

const API_BASE = '/api/v1/auth';

/**
 * Register a new user account
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{success: boolean, user?: Object, message?: string, error?: string}>}
 */
export async function registerUser({ name, email, password }) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Registration failed (HTTP ${res.status})`);
    }
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Registration failed'
    };
  }
}

/**
 * Log in an existing user
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, user?: Object, message?: string, error?: string}>}
 */
export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Login failed (HTTP ${res.status})`);
    }
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Login failed'
    };
  }
}

/**
 * Log out user and clear session cookie
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function logoutUser() {
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Logout failed'
    };
  }
}

/**
 * Fetch current authenticated user session
 * @returns {Promise<{success: boolean, user?: Object}>}
 */
export async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!res.ok) {
      return { success: false, user: null };
    }

    const data = await res.json();
    return data;
  } catch {
    return { success: false, user: null };
  }
}
