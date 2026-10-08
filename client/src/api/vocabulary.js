/**
 * Vocabulary API Client
 * Interacts with backend /api/v1/vocabulary endpoints
 */

const API_BASE = '/api/v1/vocabulary';

/**
 * Fetch paginated vocabulary items with optional category and difficulty filters
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.limit=12]
 * @param {string} [params.category]
 * @param {string} [params.difficulty]
 * @param {string} [params.contentType]
 * @returns {Promise<{success: boolean, data: Array, total: number, page: number, totalPages: number}>}
 */
export async function fetchVocabularyWords({
  page = 1,
  limit = 12,
  category = '',
  difficulty = '',
  contentType = 'word'
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (category && category !== 'All') params.append('category', category);
    if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
    if (contentType) params.append('contentType', contentType);

    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching vocabulary words:', error);
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      totalPages: 1,
      error: error.message || 'Failed to load vocabulary'
    };
  }
}

/**
 * Fetch a single vocabulary item by ID
 * @param {string} id
 * @returns {Promise<{success: boolean, data: Object|null, error?: string}>}
 */
export async function fetchWordById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching word with id ${id}:`, error);
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to load word details'
    };
  }
}

/**
 * Check if a term already exists in the collection
 * @param {string} term
 * @param {string} [contentType='word']
 * @returns {Promise<{success: boolean, isDuplicate: boolean, existingWord?: Object}>}
 */
export async function checkWordDuplicate(term, contentType = 'word') {
  try {
    const params = new URLSearchParams({
      term,
      contentType
    });

    const res = await fetch(`${API_BASE}/check-duplicate?${params.toString()}`, {
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
    console.error('Error checking duplicate:', error);
    return {
      success: false,
      isDuplicate: false,
      error: error.message
    };
  }
}
