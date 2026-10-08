/**
 * API Client Utility
 * Communicates with backend REST API over /api/v1
 */

const API_BASE = '/api/v1';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    return {
      success: false,
      status: 'offline',
      message: error.message || 'Cannot reach API backend'
    };
  }
}
