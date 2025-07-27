import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Search,
  Visibility,
  GetApp,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';

import { useCanvasStore } from '../../stores/canvasStore';
import designApi from '../../services/designApi';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const { loadTemplate, newProject } = useCanvasStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchPublishedDesigns();
  }, []);

  const fetchPublishedDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both published and public designs
      const [publishedData, publicData] = await Promise.all([
        designApi.getDesignsByStatus('PUBLISHED').catch(() => []),
        designApi.getPublicDesigns().catch(() => [])
      ]);

      // Combine and deduplicate
      const allDesigns = [...(publishedData || []), ...(publicData || [])];
      const uniqueDesigns = allDesigns.filter((design, index, self) =>
        index === self.findIndex(d => d.id === design.id)
      );

      // Transform to template format
      const transformedTemplates = uniqueDesigns.map(design => ({
        id: design.id,
        name: design.name || 'Untitled Design',
        description: design.description || 'No description available',
        category: design.category || (design.isPublic ? 'public' : 'published'),
        thumbnail: generateThumbnail(design),
        elements: design.components || [],
        canvasConfig: design.canvasConfig,
        tags: extractTags(design),
        downloads: Math.floor(Math.random() * 500) + 50, // Mock data for now
        rating: (Math.random() * 2 + 3).toFixed(1),
        isPublic: design.isPublic,
        updatedAt: design.updatedAt,
      }));

      setTemplates(transformedTemplates);
    } catch (error) {
      console.error('Error fetching published designs:', error);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnail = (design) => {
    // Simple thumbnail generation based on design components
    const componentTypes = design.components?.map(c => c.type) || [];
    const hasTable = componentTypes.includes('table');
    const hasChart = componentTypes.includes('chart');
    const hasForm = componentTypes.includes('form') || componentTypes.includes('input');
    
    if (hasTable) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJmNmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuOSkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UYWJsZSBEZXNpZ248L3RleHQ+PC9zdmc+';
    if (hasChart) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzdkNDJhNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuOSkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGFydCBEZXNpZ248L3RleHQ+PC9zdmc+';
    if (hasForm) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMxOGM0ZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuOSkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Gb3JtIERlc2lnbjwvdGV4dD48L3N2Zz4=';
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmOGMwNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuOSkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VSSBEZXNpZ248L3RleHQ+PC9zdmc+';
  };

  const extractTags = (design) => {
    const tags = [];
    const componentTypes = design.components?.map(c => c.type) || [];
    const uniqueTypes = [...new Set(componentTypes)];
    
    uniqueTypes.forEach(type => {
      tags.push(type);
    });
    
    if (design.isPublic) tags.push('public');
    if (design.status === 'PUBLISHED') tags.push('published');
    
    return tags.slice(0, 5); // Limit to 5 tags
  };

  const handleUseTemplate = async (template) => {
    try {
      // Create a new project and load the template
      newProject();
      
      // Transform template elements back to canvas format
      const canvasElements = template.elements.map(element => ({
        ...element,
        x: element.position?.x || element.x || 0,
        y: element.position?.y || element.y || 0,
        width: element.size?.width || element.width || 100,
        height: element.size?.height || element.height || 100,
      }));
      
      loadTemplate({ 
        elements: canvasElements,
        canvasConfig: template.canvasConfig
      });
      
      // Navigate to the editor
      navigate('/editor');
    } catch (error) {
      console.error('Error loading template:', error);
      setError('Failed to load template. Please try again.');
    }
  };

  const handlePreviewTemplate = (template) => {
    // For now, just use the template - could open a preview modal later
    handleUseTemplate(template);
  };

  const toggleFavorite = (templateId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'published', label: 'Published Designs' },
    { value: 'public', label: 'Public Designs' },
    { value: 'dashboard', label: 'Dashboards' },
    { value: 'form', label: 'Forms' },
    { value: 'layout', label: 'Layouts' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Template Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose from our collection of professionally designed templates
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <IconButton
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                onClick={() => toggleFavorite(template.id)}
              >
                {favorites.has(template.id) ? (
                  <Favorite sx={{ color: 'error.main' }} />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              
              <CardMedia
                component="img"
                height="160"
                image={template.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U5ZWNlZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDEwNywxMTQsMTI4LDAuOCkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZW1wbGF0ZTwvdGV4dD48L3N2Zz4='}
                alt={template.name}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" component="h3" gutterBottom noWrap>
                  {template.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                    minHeight: '2.5em'
                  }}
                >
                  {template.description}
                </Typography>
                
                {template.tags && template.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {template.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {template.isPublic ? 'Public' : 'Published'}
                  </Typography>
                  {template.updatedAt && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handlePreviewTemplate(template)}
                >
                  Preview
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<GetApp />}
                  onClick={() => handleUseTemplate(template)}
                  sx={{ ml: 'auto' }}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!loading && filteredTemplates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or browse all categories
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TemplateGallery;
