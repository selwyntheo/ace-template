import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasStore } from '../../stores/canvasStore';
import { createMockElement, createMockProject } from '../utils';

describe('Canvas Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useCanvasStore.getState().newProject();
    });
  });

  describe('Element Management', () => {
    it('should add an element to the canvas', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      expect(result.current.elements).toHaveLength(1);
      expect(result.current.elements[0]).toMatchObject(mockElement);
      expect(result.current.selectedElementId).toBe(mockElement.id);
    });

    it('should update an element', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      const updates = { x: 200, y: 200 };

      act(() => {
        result.current.updateElement(mockElement.id, updates);
      });

      const updatedElement = result.current.elements.find(el => el.id === mockElement.id);
      expect(updatedElement.x).toBe(200);
      expect(updatedElement.y).toBe(200);
    });

    it('should remove an element', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      expect(result.current.elements).toHaveLength(1);

      act(() => {
        result.current.removeElement(mockElement.id);
      });

      expect(result.current.elements).toHaveLength(0);
      expect(result.current.selectedElementId).toBeNull();
    });

    it('should duplicate an element', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      act(() => {
        result.current.duplicateElement(mockElement.id);
      });

      expect(result.current.elements).toHaveLength(2);
      const duplicatedElement = result.current.elements[1];
      expect(duplicatedElement.id).not.toBe(mockElement.id);
      expect(duplicatedElement.x).toBe(mockElement.x + 20);
      expect(duplicatedElement.y).toBe(mockElement.y + 20);
    });

    it('should select an element', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      act(() => {
        result.current.selectElement(mockElement.id);
      });

      expect(result.current.selectedElementId).toBe(mockElement.id);
      expect(result.current.selectedElement).toMatchObject(mockElement);
    });

    it('should clear selection', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedElementId).toBeNull();
      expect(result.current.selectedElement).toBeNull();
    });
  });

  describe('History Management', () => {
    it('should track history when adding elements', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('should undo element addition', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      expect(result.current.elements).toHaveLength(1);

      act(() => {
        result.current.undo();
      });

      expect(result.current.elements).toHaveLength(0);
      expect(result.current.canRedo).toBe(true);
    });

    it('should redo element addition', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      act(() => {
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.elements).toHaveLength(1);
      expect(result.current.canUndo).toBe(true);
    });
  });

  describe('Project Management', () => {
    it('should create a new project', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      act(() => {
        result.current.newProject();
      });

      expect(result.current.elements).toHaveLength(0);
      expect(result.current.selectedElementId).toBeNull();
      expect(result.current.project.name).toBe('Untitled Project');
    });

    it('should save a project', async () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      let projectId;
      await act(async () => {
        projectId = await result.current.saveProject();
      });

      expect(projectId).toBeDefined();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should load a project', async () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockProject = createMockProject();
      
      // Mock localStorage to return our project
      localStorage.getItem.mockReturnValue(JSON.stringify(mockProject));

      let loaded;
      await act(async () => {
        loaded = await result.current.loadProject(mockProject.id);
      });

      expect(loaded).toBe(true);
      expect(result.current.elements).toHaveLength(mockProject.elements.length);
      expect(result.current.project.name).toBe(mockProject.name);
    });
  });

  describe('Template Management', () => {
    it('should load a template', () => {
      const { result } = renderHook(() => useCanvasStore());
      const template = {
        elements: [createMockElement()],
      };

      act(() => {
        result.current.loadTemplate(template);
      });

      expect(result.current.elements).toHaveLength(1);
      expect(result.current.selectedElementId).toBeNull();
    });
  });

  describe('Export/Import', () => {
    it('should export project to JSON', () => {
      const { result } = renderHook(() => useCanvasStore());
      const mockElement = createMockElement();

      act(() => {
        result.current.addElement(mockElement);
      });

      const exported = result.current.exportToJSON();

      expect(exported).toHaveProperty('project');
      expect(exported).toHaveProperty('elements');
      expect(exported).toHaveProperty('exportedAt');
      expect(exported.elements).toHaveLength(1);
    });

    it('should import project from JSON', () => {
      const { result } = renderHook(() => useCanvasStore());
      const importData = {
        project: createMockProject(),
        elements: [createMockElement()],
      };

      act(() => {
        result.current.importFromJSON(importData);
      });

      expect(result.current.elements).toHaveLength(1);
      expect(result.current.project.name).toBe(importData.project.name);
    });
  });

  describe('Bulk Operations', () => {
    it('should move multiple elements', () => {
      const { result } = renderHook(() => useCanvasStore());
      const element1 = createMockElement({ x: 100, y: 100 });
      const element2 = createMockElement({ x: 200, y: 200 });

      act(() => {
        result.current.addElement(element1);
        result.current.addElement(element2);
      });

      act(() => {
        result.current.moveElements([element1.id, element2.id], 50, 50);
      });

      const movedElement1 = result.current.elements.find(el => el.id === element1.id);
      const movedElement2 = result.current.elements.find(el => el.id === element2.id);

      expect(movedElement1.x).toBe(150);
      expect(movedElement1.y).toBe(150);
      expect(movedElement2.x).toBe(250);
      expect(movedElement2.y).toBe(250);
    });
  });
});
