import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockProject } from '../../utils';
import ProjectManager from '../../../pages/ProjectManager/ProjectManager';

// Mock the canvas store
const mockStore = {
  projects: [
    createMockProject({ id: '1', name: 'Website Redesign', lastModified: '2024-01-15', status: 'active' }),
    createMockProject({ id: '2', name: 'Mobile App UI', lastModified: '2024-01-14', status: 'completed' }),
    createMockProject({ id: '3', name: 'Dashboard Layout', lastModified: '2024-01-13', status: 'draft' }),
  ],
  newProject: vi.fn(),
  loadProject: vi.fn(),
  deleteProject: vi.fn(),
  duplicateProject: vi.fn(),
  exportProject: vi.fn(),
};

vi.mock('../../../stores/canvasStore', () => ({
  useCanvasStore: () => mockStore,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProjectManager', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page header', () => {
    render(<ProjectManager />);

    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Manage your design projects')).toBeInTheDocument();
  });

  it('should display toolbar with actions', () => {
    render(<ProjectManager />);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
  });

  it('should show project list by default', () => {
    render(<ProjectManager />);

    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Mobile App UI')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Layout')).toBeInTheDocument();
  });

  it('should display project details correctly', () => {
    render(<ProjectManager />);

    const firstProject = screen.getByText('Website Redesign').closest('.MuiCard-root');
    
    within(firstProject).getByText('Jan 15, 2024');
    within(firstProject).getByText('Active');
    within(firstProject).getByText('5 elements');
  });

  it('should handle creating new project', async () => {
    render(<ProjectManager />);

    const createButton = screen.getByText('Create New Project');
    await user.click(createButton);

    expect(mockStore.newProject).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/editor');
  });

  it('should handle opening project', async () => {
    render(<ProjectManager />);

    const openButton = screen.getAllByText('Open')[0];
    await user.click(openButton);

    expect(mockStore.loadProject).toHaveBeenCalledWith('1');
    expect(mockNavigate).toHaveBeenCalledWith('/editor');
  });

  it('should handle deleting project', async () => {
    render(<ProjectManager />);

    const moreButton = screen.getAllByRole('button', { name: /more actions/i })[0];
    await user.click(moreButton);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    // Should open confirmation dialog
    expect(screen.getByText('Delete Project')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this project? This action cannot be undone.')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    expect(mockStore.deleteProject).toHaveBeenCalledWith('1');
  });

  it('should handle duplicating project', async () => {
    render(<ProjectManager />);

    const moreButton = screen.getAllByRole('button', { name: /more actions/i })[0];
    await user.click(moreButton);

    const duplicateButton = screen.getByText('Duplicate');
    await user.click(duplicateButton);

    expect(mockStore.duplicateProject).toHaveBeenCalledWith('1');
  });

  it('should handle exporting project', async () => {
    render(<ProjectManager />);

    const moreButton = screen.getAllByRole('button', { name: /more actions/i })[0];
    await user.click(moreButton);

    const exportButton = screen.getByText('Export');
    await user.click(exportButton);

    expect(mockStore.exportProject).toHaveBeenCalledWith('1');
  });

  it('should filter projects by search term', async () => {
    render(<ProjectManager />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    await user.type(searchInput, 'Website');

    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.queryByText('Mobile App UI')).not.toBeInTheDocument();
  });

  it('should filter projects by status', async () => {
    render(<ProjectManager />);

    const statusFilter = screen.getByLabelText('Filter by status');
    await user.click(statusFilter);

    const completedOption = screen.getByText('Completed');
    await user.click(completedOption);

    expect(screen.getByText('Mobile App UI')).toBeInTheDocument();
    expect(screen.queryByText('Website Redesign')).not.toBeInTheDocument();
  });

  it('should sort projects', async () => {
    render(<ProjectManager />);

    const sortSelect = screen.getByLabelText('Sort by');
    await user.click(sortSelect);

    const nameOption = screen.getByText('Name (A-Z)');
    await user.click(nameOption);

    // Projects should be reordered
    const projectCards = screen.getAllByText(/Website Redesign|Mobile App UI|Dashboard Layout/);
    expect(projectCards[0]).toHaveTextContent('Dashboard Layout');
  });

  it('should toggle between list and grid view', async () => {
    render(<ProjectManager />);

    const gridViewButton = screen.getByRole('button', { name: /grid view/i });
    await user.click(gridViewButton);

    // Should switch to grid layout
    expect(screen.getByTestId('grid-view')).toBeInTheDocument();

    const listViewButton = screen.getByRole('button', { name: /list view/i });
    await user.click(listViewButton);

    // Should switch back to list layout
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
  });

  it('should handle empty search results', async () => {
    render(<ProjectManager />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria or create a new project')).toBeInTheDocument();
  });

  it('should show status badges with correct colors', () => {
    render(<ProjectManager />);

    const activeStatus = screen.getByText('Active');
    const completedStatus = screen.getByText('Completed');
    const draftStatus = screen.getByText('Draft');

    expect(activeStatus).toHaveStyle({ color: expect.stringMatching(/success/) });
    expect(completedStatus).toHaveStyle({ color: expect.stringMatching(/info/) });
    expect(draftStatus).toHaveStyle({ color: expect.stringMatching(/warning/) });
  });

  it('should handle project statistics display', () => {
    render(<ProjectManager />);

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should cancel delete operation', async () => {
    render(<ProjectManager />);

    const moreButton = screen.getAllByRole('button', { name: /more actions/i })[0];
    await user.click(moreButton);

    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockStore.deleteProject).not.toHaveBeenCalled();
    expect(screen.queryByText('Delete Project')).not.toBeInTheDocument();
  });

  it('should display project thumbnails', () => {
    render(<ProjectManager />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); // One for each project
  });

  it('should format dates correctly', () => {
    render(<ProjectManager />);

    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 14, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 13, 2024')).toBeInTheDocument();
  });
});
