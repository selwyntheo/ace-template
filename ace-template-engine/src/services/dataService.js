/**
 * Data Service for handling component database operations
 * Provides methods for executing data actions defined in components
 */

class DataService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    this.cache = new Map();
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Function to modify request before sending
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Function to modify response after receiving
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Execute a data action for a component
   * @param {Object} action - The data action configuration
   * @param {Object} context - Additional context (component props, user data, etc.)
   * @returns {Promise} - Promise resolving to the action result
   */
  async executeAction(action, context = {}) {
    const {
      type,
      endpoint,
      method = 'GET',
      params = {},
      headers = {},
      onSuccess,
      onError,
      cacheKey,
      cacheTTL = 300000, // 5 minutes default
    } = action;

    try {
      // Check cache first for GET requests
      if (method === 'GET' && cacheKey && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < cacheTTL) {
          return cached.data;
        }
      }

      // Prepare request configuration
      const config = await this.prepareRequest({
        endpoint,
        method,
        params,
        headers,
        context,
      });

      // Execute request
      const response = await this.makeRequest(config);
      
      // Cache successful GET responses
      if (method === 'GET' && cacheKey && response.ok) {
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      // Execute success handler if provided
      if (onSuccess && typeof onSuccess === 'string') {
        try {
          const successHandler = new Function('data', 'context', onSuccess);
          successHandler(response.data, context);
        } catch (error) {
          console.warn('Error executing success handler:', error);
        }
      }

      return response.data;

    } catch (error) {
      console.error(`Data action failed (${type}):`, error);

      // Execute error handler if provided
      if (onError && typeof onError === 'string') {
        try {
          const errorHandler = new Function('error', 'context', onError);
          errorHandler(error, context);
        } catch (handlerError) {
          console.warn('Error executing error handler:', handlerError);
        }
      }

      throw error;
    }
  }

  /**
   * Prepare request configuration with interceptors
   * @param {Object} config - Base request configuration
   * @returns {Object} - Processed request configuration
   */
  async prepareRequest(config) {
    let processedConfig = { ...config };

    // Apply request interceptors
    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    // Process endpoint - make it absolute if relative
    if (!processedConfig.endpoint.startsWith('http')) {
      processedConfig.endpoint = `${this.baseURL}${processedConfig.endpoint}`;
    }

    // Merge default headers
    processedConfig.headers = {
      'Content-Type': 'application/json',
      ...processedConfig.headers,
    };

    return processedConfig;
  }

  /**
   * Make HTTP request
   * @param {Object} config - Request configuration
   * @returns {Promise} - Promise resolving to response
   */
  async makeRequest(config) {
    const { endpoint, method, params, headers } = config;

    const fetchOptions = {
      method,
      headers,
    };

    let url = endpoint;

    // Handle different HTTP methods
    if (method === 'GET') {
      // Add query parameters for GET requests
      if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
      }
    } else {
      // Add body for non-GET requests
      if (Object.keys(params).length > 0) {
        fetchOptions.body = JSON.stringify(params);
      }
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const result = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      ok: response.ok,
    };

    // Apply response interceptors
    let processedResult = result;
    for (const interceptor of this.interceptors.response) {
      processedResult = await interceptor(processedResult);
    }

    return processedResult;
  }

  /**
   * Execute multiple actions in sequence
   * @param {Array} actions - Array of data actions
   * @param {Object} context - Shared context for all actions
   * @returns {Promise} - Promise resolving to array of results
   */
  async executeActions(actions, context = {}) {
    const results = [];
    
    for (const action of actions) {
      try {
        const result = await this.executeAction(action, context);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Execute multiple actions in parallel
   * @param {Array} actions - Array of data actions
   * @param {Object} context - Shared context for all actions
   * @returns {Promise} - Promise resolving to array of results
   */
  async executeActionsParallel(actions, context = {}) {
    const promises = actions.map(async (action) => {
      try {
        const result = await this.executeAction(action, context);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    return Promise.all(promises);
  }

  /**
   * Clear cache
   * @param {string} key - Specific cache key to clear, or null to clear all
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get predefined action templates for common operations
   * @param {string} type - The component type
   * @returns {Array} - Array of action templates
   */
  getActionTemplates(type) {
    const templates = {
      table: [
        {
          name: 'Fetch Table Data',
          type: 'fetch',
          method: 'GET',
          endpoint: '/api/table-data',
          params: { page: 1, limit: 20 },
          onSuccess: 'function(data) { this.updateTableData(data.rows); }',
        },
        {
          name: 'Delete Row',
          type: 'delete',
          method: 'DELETE',
          endpoint: '/api/table-data/{id}',
          onSuccess: 'function(data) { this.refreshTable(); }',
        },
      ],
      form: [
        {
          name: 'Submit Form',
          type: 'create',
          method: 'POST',
          endpoint: '/api/form-submit',
          onSuccess: 'function(data) { this.showSuccessMessage("Form submitted successfully"); }',
        },
        {
          name: 'Load Form Data',
          type: 'fetch',
          method: 'GET',
          endpoint: '/api/form-data/{id}',
          onSuccess: 'function(data) { this.populateForm(data); }',
        },
      ],
      list: [
        {
          name: 'Fetch List Items',
          type: 'fetch',
          method: 'GET',
          endpoint: '/api/list-items',
          params: { category: 'all' },
          onSuccess: 'function(data) { this.updateList(data.items); }',
        },
      ],
      select: [
        {
          name: 'Load Options',
          type: 'fetch',
          method: 'GET',
          endpoint: '/api/select-options',
          onSuccess: 'function(data) { this.setOptions(data.options); }',
        },
      ],
      chart: [
        {
          name: 'Fetch Chart Data',
          type: 'fetch',
          method: 'GET',
          endpoint: '/api/chart-data',
          params: { period: '7d' },
          onSuccess: 'function(data) { this.updateChart(data.series); }',
        },
      ],
    };

    return templates[type.toLowerCase()] || [];
  }
}

// Create singleton instance
const dataService = new DataService();

// Add default interceptors
dataService.addRequestInterceptor(async (config) => {
  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

dataService.addResponseInterceptor(async (response) => {
  // Log API calls in development
  if (import.meta.env.DEV) {
    console.log('API Response:', response);
  }
  
  return response;
});

export default dataService;
