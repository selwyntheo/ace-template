// API service for design operations
const API_BASE_URL = 'http://localhost:8080/api';

class DesignApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses (like DELETE operations)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Design CRUD Operations
  async createDesign(designData, createdBy = 'user') {
    return await this.request('/designs', {
      method: 'POST',
      body: JSON.stringify(designData),
      headers: {
        'X-User-ID': createdBy
      }
    });
  }

  async getAllDesigns(options = {}) {
    const {
      paginated = false,
      page = 0,
      size = 10,
      sortBy = 'updatedAt',
      sortDirection = 'desc'
    } = options;

    const params = new URLSearchParams({
      paginated: paginated.toString(),
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection
    });

    return await this.request(`/designs?${params}`);
  }

  async getDesignById(id) {
    return await this.request(`/designs/${id}`);
  }

  async updateDesign(id, designData, updatedBy = 'user') {
    return await this.request(`/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(designData),
      headers: {
        'X-User-ID': updatedBy
      }
    });
  }

  async patchDesign(id, partialData, updatedBy = 'user') {
    return await this.request(`/designs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partialData),
      headers: {
        'X-User-ID': updatedBy
      }
    });
  }

  async deleteDesign(id) {
    return await this.request(`/designs/${id}`, {
      method: 'DELETE'
    });
  }

  // Search and filtering
  async searchDesigns(searchTerm) {
    const params = new URLSearchParams({ q: searchTerm });
    return await this.request(`/designs/search?${params}`);
  }

  async getDesignsByCreator(createdBy, options = {}) {
    const {
      paginated = false,
      page = 0,
      size = 10,
      sortBy = 'updatedAt',
      sortDirection = 'desc'
    } = options;

    const params = new URLSearchParams({
      paginated: paginated.toString(),
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection
    });

    return await this.request(`/designs/creator/${createdBy}?${params}`);
  }

  async getDesignsByStatus(status) {
    return await this.request(`/designs/status/${status}`);
  }

  async getPublicDesigns() {
    return await this.request('/designs/public');
  }

  async getDesignsByTag(tag) {
    return await this.request(`/designs/tag/${tag}`);
  }

  async getDesignsByAllTags(tags) {
    return await this.request('/designs/tags', {
      method: 'POST',
      body: JSON.stringify(tags)
    });
  }

  async getDesignsByCategory(category) {
    return await this.request(`/designs/category/${category}`);
  }

  async getDesignsByComponentTypes(componentTypes) {
    return await this.request('/designs/components', {
      method: 'POST',
      body: JSON.stringify(componentTypes)
    });
  }

  async getDesignsCreatedBetween(startDate, endDate) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    return await this.request(`/designs/created-between?${params}`);
  }

  async getDesignsUpdatedAfter(date) {
    const params = new URLSearchParams({
      date: date.toISOString()
    });
    return await this.request(`/designs/updated-after?${params}`);
  }

  async cloneDesign(id, newName, createdBy = 'user') {
    const params = new URLSearchParams({
      newName,
      createdBy
    });
    return await this.request(`/designs/${id}/clone?${params}`, {
      method: 'POST'
    });
  }

  // Statistics
  async getDesignStats() {
    return await this.request('/designs/stats');
  }

  async getDesignStatsByUser(createdBy) {
    return await this.request(`/designs/stats/user/${createdBy}`);
  }

  // Bulk operations
  async bulkUpdateStatus(designIds, status, updatedBy = 'user') {
    return await this.request('/designs/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({
        designIds,
        status,
        updatedBy
      })
    });
  }

  async exportDesign(id) {
    const response = await fetch(`${this.baseURL}/designs/${id}/export`);
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    return await response.blob();
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }

  // Canvas operations
  async saveCanvasState(designId, canvasState, updatedBy = 'user') {
    return await this.patchDesign(designId, {
      canvasConfig: canvasState.config,
      components: canvasState.components,
      globalStyles: canvasState.globalStyles
    }, updatedBy);
  }

  async saveComponent(designId, component, updatedBy = 'user') {
    const design = await this.getDesignById(designId);
    
    // Update or add component
    const existingComponentIndex = design.components?.findIndex(c => c.id === component.id) ?? -1;
    const components = design.components || [];
    
    if (existingComponentIndex >= 0) {
      components[existingComponentIndex] = component;
    } else {
      components.push(component);
    }

    return await this.patchDesign(designId, { components }, updatedBy);
  }

  async deleteComponent(designId, componentId, updatedBy = 'user') {
    const design = await this.getDesignById(designId);
    const components = design.components?.filter(c => c.id !== componentId) || [];
    return await this.patchDesign(designId, { components }, updatedBy);
  }

  // Auto-save functionality
  setupAutoSave(designId, getCanvasState, interval = 5000) {
    let autoSaveTimer;
    let lastSavedState = null;

    const saveIfChanged = async () => {
      try {
        const currentState = getCanvasState();
        const stateString = JSON.stringify(currentState);
        
        if (stateString !== lastSavedState) {
          await this.saveCanvasState(designId, currentState);
          lastSavedState = stateString;
          console.log('Auto-saved design at', new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    const startAutoSave = () => {
      autoSaveTimer = setInterval(saveIfChanged, interval);
    };

    const stopAutoSave = () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
      }
    };

    // Initial save to establish baseline
    saveIfChanged().then(() => {
      startAutoSave();
    });

    return { startAutoSave, stopAutoSave, saveNow: saveIfChanged };
  }
}

export default new DesignApiService();
