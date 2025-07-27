import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import theme from '../theme/theme';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <DndProvider backend={HTML5Backend}>
            {children}
          </DndProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Test data generators
export const createMockElement = (overrides = {}) => ({
  id: `element-${Date.now()}`,
  type: 'text',
  x: 100,
  y: 100,
  width: 200,
  height: 40,
  properties: {
    content: 'Sample Text',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
  },
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: `project-${Date.now()}`,
  name: 'Test Project',
  elements: [createMockElement()],
  lastModified: new Date(),
  ...overrides,
});

export const createMockTemplate = (overrides = {}) => ({
  id: '1',
  name: 'Test Template',
  description: 'A test template',
  category: 'web',
  thumbnail: 'https://via.placeholder.com/300x200',
  elements: [createMockElement()],
  tags: ['test', 'sample'],
  downloads: 100,
  rating: 4.5,
  ...overrides,
});

// Canvas test utilities
export const mockCanvasInteraction = {
  dragStart: (element, { clientX = 0, clientY = 0 } = {}) => ({
    type: 'dragstart',
    dataTransfer: {
      setData: vi.fn(),
      effectAllowed: 'copy',
    },
    clientX,
    clientY,
  }),
  drop: (target, { clientX = 100, clientY = 100 } = {}) => ({
    type: 'drop',
    dataTransfer: {
      getData: vi.fn().mockReturnValue(JSON.stringify({
        type: 'component',
        componentType: 'text',
        componentData: { type: 'text', name: 'Text' },
      })),
    },
    clientX,
    clientY,
  }),
};

// Store test utilities
export const createMockStore = (initialState = {}) => {
  const state = {
    elements: [],
    selectedElementId: null,
    history: { past: [], present: null, future: [] },
    project: { id: null, name: 'Untitled Project', lastModified: new Date() },
    ...initialState,
  };

  const actions = {
    addElement: vi.fn(),
    updateElement: vi.fn(),
    removeElement: vi.fn(),
    selectElement: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    saveProject: vi.fn(),
    loadProject: vi.fn(),
    newProject: vi.fn(),
    loadTemplate: vi.fn(),
  };

  return { ...state, ...actions };
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
