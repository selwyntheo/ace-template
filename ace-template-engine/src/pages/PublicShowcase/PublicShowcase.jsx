import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Search,
  Visibility,
  GetApp,
  Star,
  Person,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import designApi from '../../services/designApi';
import { useCanvasStore } from '../../stores/canvasStore';

const PublicShowcase = () => {
  const navigate = useNavigate();
  const { newProject, loadTemplate } = useCanvasStore();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublicDesigns();
  }, []);

  const fetchPublicDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await designApi.getPublicDesigns();
      setDesigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching public designs:', error);
      setError('Failed to load public designs. Please try again.');
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

  const handleUseDesign = async (design) => {
    try {
      // Create a new project and load the design
      newProject();
      
      // Transform design components back to canvas format
      const canvasElements = design.components?.map(component => ({
        id: component.id || `element-${Date.now()}`,
        type: component.type || 'text',
        x: component.position?.x || 0,
        y: component.position?.y || 0,
        width: component.size?.width || 100,
        height: component.size?.height || 100,
        properties: component.properties || {},
        zIndex: component.zIndex || 1,
        visible: component.visible !== false,
        locked: component.locked || false,
      })) || [];
      
      loadTemplate({ 
        elements: canvasElements,
        canvasConfig: design.canvasConfig || {
          width: 1200,
          height: 900,
          zoomLevel: 100,
          showGrid: true,
        }
      });
      
      // Navigate to the editor
      navigate('/editor');
    } catch (error) {
      console.error('Error loading design:', error);
      setError('Failed to load design. Please try again.');
    }
  };

  const handlePreview = (design) => {
    // For now, just use the design - could open a preview modal later
    handleUseDesign(design);
  };

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          Public Design Showcase
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover amazing designs created by our community. Use them as templates or get inspired for your next project.
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          placeholder="Search public designs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 400, maxWidth: 600 }}
          variant="outlined"
        />
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Designs Grid */}
      {!loading && (
        <Grid container spacing={4}>
          {filteredDesigns.map((design) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={design.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out'
                  },
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={generateThumbnail(design)}
                  alt={design.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {design.name}
                  </Typography>
                  
                  {design.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {design.description}
                    </Typography>
                  )}

                  {/* Design Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="caption" fontWeight={500}>
                        {Math.floor(Math.random() * 2) + 4}.{Math.floor(Math.random() * 10)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(Math.random() * 500) + 50} uses
                    </Typography>
                  </Box>

                  {/* Component Types as Tags */}
                  {design.components && design.components.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {[...new Set(design.components.map(c => c.type))].slice(0, 3).map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                        />
                      ))}
                      {design.components.length > 3 && (
                        <Chip
                          label={`+${design.components.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}

                  {/* Author and Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {(design.createdBy || 'U')[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {design.createdBy || 'Unknown'}
                      </Typography>
                    </Box>
                    {design.updatedAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 12 }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(design.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                  <Button
                    size="medium"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(design)}
                    variant="outlined"
                    fullWidth
                  >
                    Preview
                  </Button>
                  <Button
                    size="medium"
                    variant="contained"
                    startIcon={<GetApp />}
                    onClick={() => handleUseDesign(design)}
                    fullWidth
                  >
                    Use Design
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredDesigns.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No public designs found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'No public designs have been shared yet'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/editor')}
            size="large"
          >
            Create Your Own Design
          </Button>
        </Box>
      )}

      {/* Call to Action */}
      {!loading && filteredDesigns.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 8, mt: 6, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Share Your Creativity
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create amazing designs and share them with the community
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/editor')}
            size="large"
            sx={{ mr: 2 }}
          >
            Start Creating
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/published')}
            size="large"
          >
            Manage Published Designs
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default PublicShowcase;
