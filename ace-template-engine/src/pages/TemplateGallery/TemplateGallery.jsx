import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search,
  Visibility,
  GetApp,
  Star,
  StarBorder,
} from '@mui/icons-material';

import { useCanvasStore } from '../../stores/canvasStore';

const TemplateGallery = () => {
  const navigate = useNavigate();
  const { loadTemplate, newProject } = useCanvasStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set(['1', '3']));

  // Mock template data
  const templates = [
    {
      id: '1',
      name: 'Modern Landing Page',
      description: 'Clean and modern landing page template with hero section and features',
      category: 'web',
      thumbnail: 'https://via.placeholder.com/300x200?text=Landing+Page',
      elements: [
        {
          id: 'header-1',
          type: 'text',
          x: 50,
          y: 50,
          width: 400,
          height: 60,
          properties: {
            content: 'Welcome to Our Platform',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1976d2',
          },
        },
        {
          id: 'subtitle-1',
          type: 'text',
          x: 50,
          y: 130,
          width: 500,
          height: 40,
          properties: {
            content: 'Build amazing applications with our powerful tools',
            fontSize: '18px',
            color: '#666',
          },
        },
        {
          id: 'cta-button-1',
          type: 'button',
          x: 50,
          y: 200,
          width: 150,
          height: 45,
          properties: {
            label: 'Get Started',
            backgroundColor: '#1976d2',
            color: '#ffffff',
            borderRadius: '8px',
          },
        },
      ],
      tags: ['modern', 'landing', 'business'],
      downloads: 1250,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Email Newsletter',
      description: 'Professional email newsletter template with responsive design',
      category: 'email',
      thumbnail: 'https://via.placeholder.com/300x200?text=Newsletter',
      elements: [
        {
          id: 'email-header',
          type: 'container',
          x: 20,
          y: 20,
          width: 600,
          height: 80,
          properties: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px',
          },
        },
        {
          id: 'email-title',
          type: 'text',
          x: 40,
          y: 40,
          width: 300,
          height: 40,
          properties: {
            content: 'Weekly Newsletter',
            fontSize: '24px',
            fontWeight: 'bold',
          },
        },
      ],
      tags: ['email', 'newsletter', 'professional'],
      downloads: 890,
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Dashboard Layout',
      description: 'Complete dashboard template with charts and data visualization',
      category: 'dashboard',
      thumbnail: 'https://via.placeholder.com/300x200?text=Dashboard',
      elements: [
        {
          id: 'dashboard-title',
          type: 'text',
          x: 30,
          y: 30,
          width: 300,
          height: 50,
          properties: {
            content: 'Analytics Dashboard',
            fontSize: '28px',
            fontWeight: 'bold',
          },
        },
        {
          id: 'chart-container',
          type: 'container',
          x: 30,
          y: 100,
          width: 400,
          height: 250,
          properties: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
          },
        },
      ],
      tags: ['dashboard', 'analytics', 'charts'],
      downloads: 2100,
      rating: 4.9,
    },
    {
      id: '4',
      name: 'Product Showcase',
      description: 'Elegant product showcase template for e-commerce',
      category: 'ecommerce',
      thumbnail: 'https://via.placeholder.com/300x200?text=Product',
      elements: [
        {
          id: 'product-image',
          type: 'image',
          x: 50,
          y: 50,
          width: 300,
          height: 250,
          properties: {
            src: 'https://via.placeholder.com/300x250?text=Product+Image',
            alt: 'Product Image',
            borderRadius: '8px',
          },
        },
        {
          id: 'product-title',
          type: 'text',
          x: 400,
          y: 70,
          width: 250,
          height: 40,
          properties: {
            content: 'Premium Product',
            fontSize: '24px',
            fontWeight: 'bold',
          },
        },
      ],
      tags: ['product', 'ecommerce', 'showcase'],
      downloads: 750,
      rating: 4.6,
    },
    {
      id: '5',
      name: 'Contact Form',
      description: 'Simple and clean contact form template',
      category: 'forms',
      thumbnail: 'https://via.placeholder.com/300x200?text=Contact+Form',
      elements: [
        {
          id: 'form-title',
          type: 'text',
          x: 50,
          y: 30,
          width: 200,
          height: 40,
          properties: {
            content: 'Contact Us',
            fontSize: '24px',
            fontWeight: 'bold',
          },
        },
        {
          id: 'name-input',
          type: 'input',
          x: 50,
          y: 90,
          width: 300,
          height: 40,
          properties: {
            placeholder: 'Your Name',
            type: 'text',
          },
        },
        {
          id: 'email-input',
          type: 'input',
          x: 50,
          y: 150,
          width: 300,
          height: 40,
          properties: {
            placeholder: 'Your Email',
            type: 'email',
          },
        },
      ],
      tags: ['form', 'contact', 'simple'],
      downloads: 1500,
      rating: 4.7,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web', label: 'Web Pages' },
    { value: 'email', label: 'Email Templates' },
    { value: 'dashboard', label: 'Dashboards' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'forms', label: 'Forms' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    newProject();
    loadTemplate(template);
    navigate('/editor');
  };

  const handleToggleFavorite = (templateId) => {
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

  const handlePreview = (template) => {
    // Open preview modal or navigate to preview page
    console.log('Preview template:', template);
  };

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
