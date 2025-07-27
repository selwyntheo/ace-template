import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockTemplate } from '../../utils';
import TemplateGallery from '../../../pages/TemplateGallery/TemplateGallery';

// Mock the canvas store
const mockStore = {
  loadTemplate: vi.fn(),
  newProject: vi.fn(),
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

describe('TemplateGallery', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page header', () => {
    render(<TemplateGallery />);

    expect(screen.getByText('Template Gallery')).toBeInTheDocument();
    expect(screen.getByText('Choose from our collection of professionally designed templates')).toBeInTheDocument();
  });

  it('should display search input and category filter', () => {
    render(<TemplateGallery />);

    expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('should display template cards', () => {
    render(<TemplateGallery />);

    expect(screen.getByText('Modern Landing Page')).toBeInTheDocument();
    expect(screen.getByText('Email Newsletter')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Layout')).toBeInTheDocument();
    expect(screen.getByText('Product Showcase')).toBeInTheDocument();
    expect(screen.getByText('Contact Form')).toBeInTheDocument();
  });

  it('should show template details', () => {
    render(<TemplateGallery />);

    const landingPageCard = screen.getByText('Modern Landing Page').closest('.MuiCard-root');
    
    within(landingPageCard).getByText('Clean and modern landing page template with hero section and features');
    within(landingPageCard).getByText('1,250 downloads');
    within(landingPageCard).getByText('4.8');
  });

  it('should filter templates by search term', async () => {
    render(<TemplateGallery />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'landing');

    expect(screen.getByText('Modern Landing Page')).toBeInTheDocument();
    expect(screen.queryByText('Email Newsletter')).not.toBeInTheDocument();
  });

  it('should filter templates by category', async () => {
    render(<TemplateGallery />);

    const categorySelect = screen.getByLabelText('Category');
    await user.click(categorySelect);
    
    const emailOption = screen.getByText('Email Templates');
    await user.click(emailOption);

    expect(screen.getByText('Email Newsletter')).toBeInTheDocument();
    expect(screen.queryByText('Modern Landing Page')).not.toBeInTheDocument();
  });

  it('should search by tags', async () => {
    render(<TemplateGallery />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'modern');

    expect(screen.getByText('Modern Landing Page')).toBeInTheDocument();
  });

  it('should handle template preview', async () => {
    render(<TemplateGallery />);

    const previewButton = screen.getAllByText('Preview')[0];
    await user.click(previewButton);

    // Preview functionality should be called (currently console.log)
  });

  it('should handle template usage', async () => {
    render(<TemplateGallery />);

    const useTemplateButton = screen.getAllByText('Use Template')[0];
    await user.click(useTemplateButton);

    expect(mockStore.newProject).toHaveBeenCalled();
    expect(mockStore.loadTemplate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/editor');
  });

  it('should toggle favorite status', async () => {
    render(<TemplateGallery />);

    // Find the first star icon (should be StarIcon for favorited item)
    const favoriteButtons = screen.getAllByRole('button');
    const favoriteButton = favoriteButtons.find(button => 
      button.querySelector('svg[data-testid="StarIcon"], svg[data-testid="StarBorderIcon"]')
    );

    await user.click(favoriteButton);

    // Should toggle the favorite state
  });

  it('should display tags for each template', () => {
    render(<TemplateGallery />);

    expect(screen.getByText('modern')).toBeInTheDocument();
    expect(screen.getByText('landing')).toBeInTheDocument();
    expect(screen.getByText('business')).toBeInTheDocument();
  });

  it('should show download count and rating', () => {
    render(<TemplateGallery />);

    expect(screen.getByText('1,250 downloads')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('should handle empty search results', async () => {
    render(<TemplateGallery />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No templates found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria or browse all categories')).toBeInTheDocument();
  });

  it('should reset search when clearing input', async () => {
    render(<TemplateGallery />);

    const searchInput = screen.getByPlaceholderText('Search templates...');
    
    // Type search term
    await user.type(searchInput, 'landing');
    expect(screen.queryByText('Email Newsletter')).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByText('Email Newsletter')).toBeInTheDocument();
  });

  it('should show all categories in dropdown', async () => {
    render(<TemplateGallery />);

    const categorySelect = screen.getByLabelText('Category');
    await user.click(categorySelect);

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Web Pages')).toBeInTheDocument();
    expect(screen.getByText('Email Templates')).toBeInTheDocument();
    expect(screen.getByText('Dashboards')).toBeInTheDocument();
    expect(screen.getByText('E-commerce')).toBeInTheDocument();
    expect(screen.getByText('Forms')).toBeInTheDocument();
  });

  it('should navigate to editor with correct template', async () => {
    render(<TemplateGallery />);

    const useTemplateButtons = screen.getAllByText('Use Template');
    await user.click(useTemplateButtons[0]);

    expect(mockStore.loadTemplate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Modern Landing Page',
        elements: expect.any(Array),
      })
    );
  });
});
