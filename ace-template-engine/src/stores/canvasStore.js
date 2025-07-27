          import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import { produce } from 'immer';
import designApi from '../services/designApi';

const useCanvasStore = create(
  subscribeWithSelector((set, get) => ({
    // Canvas state
    elements: [],
    selectedElementId: null,
    history: {
      past: [],
      present: null,
      future: [],
    },
    
    // Project info
    project: {
      id: null,
      name: 'Untitled Project',
      lastModified: new Date(),
    },
    
    // Projects list
    projects: [],

    // Canvas settings
    canvasSettings: {
      width: 1200,
      height: 900,
      zoom: 100,
      showGrid: true,
      showRulers: true,
    },

    // Actions
    addElement: (element) => set((state) => produce(state, (draft) => {
      const newElement = {
        ...element,
        id: element.id || `element-${uuid()}`,
      };
      
      // Save current state to history
      draft.history.past.push({
        elements: [...state.elements],
        selectedElementId: state.selectedElementId,
      });
      draft.history.future = [];
      
      draft.elements.push(newElement);
      draft.selectedElementId = newElement.id;
    })),

    updateElement: (elementId, updates) => set((state) => produce(state, (draft) => {
      const elementIndex = state.elements.findIndex(el => el.id === elementId);
      if (elementIndex !== -1) {
        // Save current state to history before updating
        draft.history.past.push({
          elements: [...state.elements],
          selectedElementId: state.selectedElementId,
        });
        draft.history.future = [];
        
        draft.elements[elementIndex] = {
          ...state.elements[elementIndex],
          ...updates,
        };
      }
    })),

    removeElement: (elementId) => set((state) => produce(state, (draft) => {
      // Save current state to history
      draft.history.past.push({
        elements: [...state.elements],
        selectedElementId: state.selectedElementId,
      });
      draft.history.future = [];
      
      draft.elements = state.elements.filter(el => el.id !== elementId);
      if (state.selectedElementId === elementId) {
        draft.selectedElementId = null;
      }
    })),

    duplicateElement: (elementId) => set((state) => produce(state, (draft) => {
      const element = state.elements.find(el => el.id === elementId);
      if (element) {
        const newElement = {
          ...element,
          id: `element-${uuid()}`,
          x: element.x + 20,
          y: element.y + 20,
        };
        
        // Save current state to history
        draft.history.past.push({
          elements: [...state.elements],
          selectedElementId: state.selectedElementId,
        });
        draft.history.future = [];
        
        draft.elements.push(newElement);
        draft.selectedElementId = newElement.id;
      }
    })),

    selectElement: (elementId) => set((state) => produce(state, (draft) => {
      draft.selectedElementId = elementId;
    })),

    clearSelection: () => set((state) => produce(state, (draft) => {
      draft.selectedElementId = null;
    })),

    // Canvas settings actions
    updateCanvasSettings: (updates) => set((state) => produce(state, (draft) => {
      draft.canvasSettings = { ...state.canvasSettings, ...updates };
    })),

    // History actions
    undo: () => set((state) => produce(state, (draft) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        draft.history.past.pop();
        draft.history.future.unshift({
          elements: [...state.elements],
          selectedElementId: state.selectedElementId,
        });
        
        draft.elements = previous.elements;
        draft.selectedElementId = previous.selectedElementId;
      }
    })),

    redo: () => set((state) => produce(state, (draft) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        draft.history.future.shift();
        draft.history.past.push({
          elements: [...state.elements],
          selectedElementId: state.selectedElementId,
        });
        
        draft.elements = next.elements;
        draft.selectedElementId = next.selectedElementId;
      }
    })),

    // Project actions
    saveProject: async (projectName, projectDescription) => {
      const state = get();
      
      // Update project info if provided
      const currentProject = {
        ...state.project,
        name: projectName || state.project.name,
        description: projectDescription || state.project.description || '',
        lastModified: new Date(),
      };
      
      const designData = {
        name: currentProject.name,
        description: currentProject.description,
        components: state.elements.map(element => ({
          id: element.id,
          type: element.type,
          name: element.name || element.type,
          properties: element.properties || {},
          styles: element.styles || {},
          position: {
            x: element.x || 0,
            y: element.y || 0
          },
          size: {
            width: element.width || 100,
            height: element.height || 100
          },
          zIndex: element.zIndex || 0,
          visible: element.visible !== undefined ? element.visible : true,
          locked: element.locked || false
        })),
        canvasConfig: {
          width: state.canvasSettings?.width || 1200,
          height: state.canvasSettings?.height || 900,
          zoomLevel: state.canvasSettings?.zoom || 100,
          showGrid: state.canvasSettings?.showGrid !== undefined ? state.canvasSettings.showGrid : true,
        },
        status: 'DRAFT',
      };
      
      // Validate required fields before sending
      if (!designData.canvasConfig) {
        console.error('Canvas config is missing, using defaults');
        designData.canvasConfig = {
          width: 1200,
          height: 900,
          zoomLevel: 100,
          showGrid: true,
        };
      }
      
      console.log('Saving design data:', designData);
      
      try {
        let savedDesign;
        if (currentProject.id) {
          // Update existing design
          savedDesign = await designApi.updateDesign(currentProject.id, designData);
        } else {
          // Create new design
          savedDesign = await designApi.createDesign(designData);
        }
        
        set((state) => produce(state, (draft) => {
          draft.project.id = savedDesign.id;
          draft.project.name = savedDesign.name;
          draft.project.description = savedDesign.description;
          draft.project.lastModified = new Date(savedDesign.updatedAt);
        }));
        
        return savedDesign.id;
      } catch (error) {
        console.error('Failed to save project to API:', error);
        // Fallback to localStorage
        const projectData = {
          id: currentProject.id || uuid(),
          name: currentProject.name,
          description: currentProject.description,
          elements: state.elements,
          lastModified: new Date(),
        };
        localStorage.setItem(`project-${projectData.id}`, JSON.stringify(projectData));
        
        set((state) => produce(state, (draft) => {
          draft.project = projectData;
        }));
        
        return projectData.id;
      }
    },

    loadProject: async (projectId) => {
      try {
        // Load design from API using the unified endpoint
        const design = await designApi.getDesignById(projectId);
        
        if (design) {
          set((state) => produce(state, (draft) => {
            // Convert design components to canvas elements
            draft.elements = (design.components || []).map(component => ({
              id: component.id,
              type: component.type,
              name: component.name,
              properties: component.properties || {},
              styles: component.styles || {},
              x: component.position?.x || 0,
              y: component.position?.y || 0,
              width: component.size?.width || 100,
              height: component.size?.height || 100,
              zIndex: component.zIndex || 0,
              visible: component.visible !== undefined ? component.visible : true,
              locked: component.locked || false
            }));
            draft.selectedElementId = null;
            draft.project = {
              id: design.id,
              name: design.name,
              description: design.description,
              lastModified: new Date(design.updatedAt),
            };
            
            // Load canvas settings if available
            if (design.canvasConfig) {
              draft.canvasSettings = {
                ...draft.canvasSettings,
                width: design.canvasConfig.width || draft.canvasSettings.width,
                height: design.canvasConfig.height || draft.canvasSettings.height,
                zoom: design.canvasConfig.zoomLevel || draft.canvasSettings.zoom,
                showGrid: design.canvasConfig.showGrid !== undefined ? design.canvasConfig.showGrid : draft.canvasSettings.showGrid,
              };
            }
            
            draft.history = {
              past: [],
              present: null,
              future: [],
            };
          }));
          
          return true;
        }
      } catch (error) {
        console.error('Failed to load project from API:', error);
      }
      return false;
    },

    newProject: () => set((state) => produce(state, (draft) => {
      draft.elements = [];
      draft.selectedElementId = null;
      draft.project = {
        id: null,
        name: 'Untitled Project',
        lastModified: new Date(),
      };
      draft.history = {
        past: [],
        present: null,
        future: [],
      };
    })),

    // Template actions
    loadTemplate: (template) => set((state) => produce(state, (draft) => {
      // Save current state to history
      draft.history.past.push({
        elements: [...state.elements],
        selectedElementId: state.selectedElementId,
      });
      draft.history.future = [];
      
      draft.elements = template.elements || [];
      draft.selectedElementId = null;
    })),

    // Computed values
    get selectedElement() {
      const state = get();
      return state.elements.find(el => el.id === state.selectedElementId) || null;
    },

    get canUndo() {
      const state = get();
      return state.history.past.length > 0;
    },

    get canRedo() {
      const state = get();
      return state.history.future.length > 0;
    },

    // Bulk operations
    selectMultipleElements: (elementIds) => set((state) => {
      // For now, just select the first one
      // Can be extended for multi-selection later
      state.selectedElementId = elementIds[0] || null;
    }),

    moveElements: (elementIds, deltaX, deltaY) => set((state) => produce(state, (draft) => {
      // Save current state to history
      draft.history.past.push({
        elements: [...state.elements],
        selectedElementId: state.selectedElementId,
      });
      draft.history.future = [];
      
      elementIds.forEach(elementId => {
        const elementIndex = state.elements.findIndex(el => el.id === elementId);
        if (elementIndex !== -1) {
          draft.elements[elementIndex].x += deltaX;
          draft.elements[elementIndex].y += deltaY;
        }
      });
    })),

    // Export functions
    exportToJSON: () => {
      const state = get();
      return {
        project: state.project,
        elements: state.elements,
        exportedAt: new Date(),
      };
    },

    importFromJSON: (data) => set((state) => produce(state, (draft) => {
      if (data.elements) {
        draft.elements = data.elements;
        draft.selectedElementId = null;
        draft.project = data.project || {
          id: null,
          name: 'Imported Project',
          lastModified: new Date(),
        };
        draft.history = {
          past: [],
          present: null,
          future: [],
        };
      }
    })),

    // Project management actions
    loadAllProjects: async () => {
      try {
        console.log('Canvas store: Loading designs from API...');
        const designs = await designApi.getAllDesigns();
        console.log('Canvas store: Received designs:', designs);
        
        set((state) => produce(state, (draft) => {
          // Convert designs to project format for the UI
          draft.projects = designs.map(design => ({
            id: design.id,
            name: design.name,
            description: design.description,
            lastModified: new Date(design.updatedAt),
            status: design.status,
            previewImage: design.previewImage,
            tags: design.tags || [],
            isPublic: design.isPublic,
            // Include component/element information for preview
            elements: (design.components || []).map(component => ({
              id: component.id,
              type: component.type,
              name: component.name,
            })),
            componentCount: (design.components || []).length,
          }));
          console.log('Canvas store: Projects set to:', draft.projects);
        }));
        
        return true;
      } catch (error) {
        console.error('Failed to load projects from API:', error);
        return false;
      }
    },

    deleteProject: async (projectId) => {
      try {
        await designApi.deleteDesign(projectId);
        
        set((state) => produce(state, (draft) => {
          const index = state.projects.findIndex(p => p.id === projectId);
          if (index !== -1) {
            draft.projects.splice(index, 1);
          }
        }));
        
        return true;
      } catch (error) {
        console.error('Failed to delete project from API:', error);
        return false;
      }
    },

    duplicateProject: async (projectId) => {
      try {
        const originalDesign = await designApi.getDesignById(projectId);
        if (originalDesign) {
          const duplicatedData = {
            ...originalDesign,
            name: `${originalDesign.name} (Copy)`,
            id: undefined, // Let API generate new ID
          };
          
          const newDesign = await designApi.createDesign(duplicatedData);
          
          set((state) => produce(state, (draft) => {
            draft.projects.push({
              id: newDesign.id,
              name: newDesign.name,
              description: newDesign.description,
              lastModified: new Date(newDesign.updatedAt),
              status: newDesign.status,
              previewImage: newDesign.previewImage,
              tags: newDesign.tags || [],
              isPublic: newDesign.isPublic,
            });
          }));
          
          return newDesign.id;
        }
      } catch (error) {
        console.error('Failed to duplicate project via API:', error);
      }
      return null;
    },

    exportProject: (projectId) => {
      const state = get();
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        const dataStr = JSON.stringify(project, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },
  }))
);

export { useCanvasStore };
