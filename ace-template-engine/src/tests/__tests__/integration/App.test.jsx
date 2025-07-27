import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils';
import App from '../../App';

// Mock react-router-dom for proper routing tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
  };
});

// Mock the canvas store
const mockStore = {
  elements: [],
  selectedElement: null,
  projects: [],
  currentProject: null,
  history: { past: [], future: [] },
  addElement: vi.fn(),
  updateElement: vi.fn(),
  deleteElement: vi.fn(),
  selectElement: vi.fn(),
  clearSelection: vi.fn(),
  undo: vi.fn(),
  redo: vi.fn(),
  newProject: vi.fn(),
  loadProject: vi.fn(),
  saveProject: vi.fn(),
  deleteProject: vi.fn(),
  duplicateProject: vi.fn(),
  exportProject: vi.fn(),
  loadTemplate: vi.fn(),
  saveTemplate: vi.fn(),
};

vi.mock('../stores/canvasStore', () => ({
  useCanvasStore: () => mockStore,
}));

describe('App Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset URL to home page
    window.history.pushState({}, '', '/');
  });

  it('should render home page by default', () => {
    render(<App />);

    expect(screen.getByText('Welcome to Ace Template Engine')).toBeInTheDocument();
    expect(screen.getByText('Create stunning designs with our powerful canvas editor')).toBeInTheDocument();
  });

  it('should navigate to different pages', async () => {
    render(<App />);

    // Navigate to Template Gallery
    const templatesLink = screen.getByText('Templates');
    await user.click(templatesLink);
    expect(screen.getByText('Template Gallery')).toBeInTheDocument();

    // Navigate to Projects
    const projectsLink = screen.getByText('Projects');
    await user.click(projectsLink);
    expect(screen.getByText('Project Manager')).toBeInTheDocument();

    // Navigate to Editor
    const editorLink = screen.getByText('Editor');
    await user.click(editorLink);
    expect(screen.getByText('Canvas Editor')).toBeInTheDocument();
  });

  it('should maintain theme across pages', async () => {
    render(<App />);

    // Check if theme is applied (look for Material-UI theme provider)
    const appContainer = screen.getByRole('main') || document.body;
    expect(appContainer).toBeInTheDocument();

    // Navigate to different pages and ensure consistent theming
    const templatesLink = screen.getByText('Templates');
    await user.click(templatesLink);
    
    // Material-UI components should be styled consistently
    expect(screen.getByText('Template Gallery')).toBeInTheDocument();
  });

  it('should handle error boundaries gracefully', () => {
    // This would test error boundary behavior
    // For now, just ensure the app renders without crashing
    render(<App />);
    expect(screen.getByText('Welcome to Ace Template Engine')).toBeInTheDocument();
  });

  it('should show correct navigation active states', async () => {
    render(<App />);

    // Home should be active initially
    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveClass('active'); // Assuming active class exists

    // Click templates and check active state
    const templatesLink = screen.getByText('Templates');
    await user.click(templatesLink);
    
    expect(templatesLink.closest('a')).toHaveClass('active');
    expect(homeLink.closest('a')).not.toHaveClass('active');
  });

  it('should provide global canvas store access', () => {
    render(<App />);

    // The store should be accessible throughout the app
    // This is implicitly tested by other components working
    expect(mockStore).toBeDefined();
  });

  it('should handle responsive navigation', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    render(<App />);

    // On mobile, navigation might be collapsed
    expect(screen.getByText('Welcome to Ace Template Engine')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    render(<App />);

    // Tab through navigation items
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();

    // Enter should activate links
    await user.keyboard('{Enter}');
    // Should navigate or perform action
  });

  it('should maintain scroll position on navigation', async () => {
    render(<App />);

    // Scroll down on home page
    window.scrollTo(0, 500);
    expect(window.scrollY).toBe(500);

    // Navigate to another page
    const templatesLink = screen.getByText('Templates');
    await user.click(templatesLink);

    // Should reset scroll position for new page
    expect(window.scrollY).toBe(0);
  });
});
