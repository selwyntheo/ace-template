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
} from '@mui/material';
import {
  Search,
  Visibility,
  GetApp,
  Star,
  StarBorder,
  Public,
  Category,
} from '@mui/icons-material';

import { useCanvasStore } from '../../stores/canvasStore';
import designApi from '../../services/designApi';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const { loadTemplate, newProject } = useCanvasStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch published designs on component mount
  useEffect(() => {
    fetchPublishedDesigns();
  }, []);

  const fetchPublishedDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both published and public designs
      const [publishedDesigns, publicDesigns] = await Promise.all([
        designApi.getDesignsByStatus('PUBLISHED'),
        designApi.getPublicDesigns()
      ]);
      
      // Combine and deduplicate designs
      const allTemplates = [...publishedDesigns, ...publicDesigns];
      const uniqueTemplates = allTemplates.reduce((acc, design) => {
        if (!acc.find(t => t.id === design.id)) {
          acc.push({
            id: design.id,
            name: design.name,
            description: design.description || 'No description available',
            category: design.metadata?.category || 'general',
            thumbnail: design.previewImage || `https://via.placeholder.com/300x200?text=${encodeURIComponent(design.name)}`,
            elements: design.components || [],
            tags: design.tags || [],
            isPublic: design.isPublic,
            status: design.status,
            createdAt: design.createdAt,
            updatedAt: design.updatedAt,
            canvasConfig: design.canvasConfig
          });
        }
        return acc;
      }, []);
      
      setTemplates(uniqueTemplates);
    } catch (err) {
      console.error('Error fetching published designs:', err);
      setError('Failed to load templates. Please try again later.');
    } finally {
      setLoading(false);
    }
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

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={template.thumbnail}
                alt={template.name}
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {template.name}
                  </Typography>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(template.id);
                    }}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    {favorites.has(template.id) ? (
                      <Star color="primary" />
                    ) : (
                      <StarBorder />
                    )}
                  </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {template.downloads.toLocaleString()} downloads
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="caption">
                      {template.rating}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handlePreview(template)}
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

      {filteredTemplates.length === 0 && (
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
