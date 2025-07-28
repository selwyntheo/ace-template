import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Public,
  PublicOff,
  Search,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import designApi from '../../services/designApi';
import { useCanvasStore } from '../../stores/canvasStore';

const PublishedDesigns = () => {
  const navigate = useNavigate();
  const { loadAllProjects } = useCanvasStore();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishDialog, setPublishDialog] = useState({
    open: false,
    design: null,
    isPublishing: false,
    isPublic: false,
  });

  useEffect(() => {
    fetchDesigns();
  }, [tabValue]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data = [];
      if (tabValue === 0) {
        // All designs
        const response = await designApi.getAllDesigns({ paginated: false, size: 50 });
        data = response.data || response || [];
      } else if (tabValue === 1) {
        // Published designs
        data = await designApi.getDesignsByStatus('PUBLISHED');
      } else {
        // Public designs
        data = await designApi.getPublicDesigns();
      }
      
      setDesigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to fetch designs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (design) => {
    setPublishDialog({
      open: true,
      design,
      isPublishing: false,
      isPublic: false,
    });
  };

  const confirmPublish = async (isPublic = false) => {
    if (!publishDialog.design) return;
    
    try {
      setPublishDialog(prev => ({ ...prev, isPublishing: true }));
      
      const { design } = publishDialog;
      if (design.status === 'PUBLISHED') {
        await designApi.unpublishDesign(design.id);
      } else {
        await designApi.publishDesign(design.id, isPublic);
      }
      
      setPublishDialog({ open: false, design: null, isPublishing: false, isPublic: false });
      await fetchDesigns();
      // Also refresh the canvas store to sync with ProjectManager
      await loadAllProjects();
    } catch (error) {
      console.error('Error updating design status:', error);
      setError('Failed to update design status. Please try again.');
      setPublishDialog(prev => ({ ...prev, isPublishing: false }));
    }
  };

  const handleEdit = (design) => {
    navigate(`/editor?designId=${design.id}`);
  };

  const handleDelete = async (design) => {
    if (window.confirm(`Are you sure you want to delete "${design.name}"?`)) {
      try {
        await designApi.deleteDesign(design.id);
        await fetchDesigns();
        // Also refresh the canvas store to sync with ProjectManager
        await loadAllProjects();
      } catch (error) {
        console.error('Error deleting design:', error);
        setError('Failed to delete design. Please try again.');
      }
    }
  };

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (design.description && design.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Published Designs
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your published designs and templates
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/editor')}
        >
          Create New Design
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Designs" />
          <Tab label="Published" />
          <Tab label="Public" />
        </Tabs>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search designs..."
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
          <CircularProgress />
        </Box>
      )}

      {/* Designs Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredDesigns.map((design) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={design.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <Box sx={{ p: 2, pb: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
                      {design.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip
                        label={design.status || 'DRAFT'}
                        size="small"
                        color={design.status === 'PUBLISHED' ? 'success' : 'default'}
                        variant="outlined"
                      />
                      {design.isPublic && (
                        <Chip
                          label="Public"
                          size="small"
                          color="info"
                          variant="outlined"
                          icon={<Public />}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  {design.description && (
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
                      {design.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Components: {design.components?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {design.updatedAt ? new Date(design.updatedAt).toLocaleDateString() : 'No date'}
                    </Typography>
                  </Box>
                </Box>
                
                <CardActions sx={{ p: 2, pt: 0, mt: 'auto' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(design)}
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handlePublishToggle(design)}
                    title={design.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    color={design.status === 'PUBLISHED' ? 'success' : 'default'}
                  >
                    {design.isPublic ? <Public /> : design.status === 'PUBLISHED' ? <Visibility /> : <PublicOff />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(design)}
                    title="Delete"
                    color="error"
                    sx={{ ml: 'auto' }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && filteredDesigns.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No designs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Create your first design to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/editor')}
          >
            Create Design
          </Button>
        </Box>
      )}

      {/* Publish Dialog */}
      <Dialog
        open={publishDialog.open}
        onClose={() => !publishDialog.isPublishing && setPublishDialog({ open: false, design: null, isPublishing: false, isPublic: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {publishDialog.design?.status === 'PUBLISHED' ? 'Unpublish Design' : 'Publish Design'}
        </DialogTitle>
        <DialogContent>
          {publishDialog.design?.status === 'PUBLISHED' ? (
            <Typography>
              Are you sure you want to unpublish "{publishDialog.design?.name}"? 
              This will remove it from the template gallery and make it private.
            </Typography>
          ) : (
            <Box>
              <Typography sx={{ mb: 3 }}>
                Publish "{publishDialog.design?.name}" to make it available in the template gallery.
              </Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={publishDialog.isPublic} 
                    onChange={(e) => setPublishDialog(prev => ({
                      ...prev,
                      isPublic: e.target.checked
                    }))}
                  />
                }
                label="Make this design public (visible to all users)"
                sx={{ display: 'block' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPublishDialog({ open: false, design: null, isPublishing: false, isPublic: false })}
            disabled={publishDialog.isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (publishDialog.design?.status === 'PUBLISHED') {
                confirmPublish(false);
              } else {
                confirmPublish(publishDialog.isPublic);
              }
            }}
            variant="contained"
            disabled={publishDialog.isPublishing}
            color={publishDialog.design?.status === 'PUBLISHED' ? 'error' : 'primary'}
          >
            {publishDialog.isPublishing ? (
              <CircularProgress size={20} />
            ) : (
              publishDialog.design?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PublishedDesigns;
