import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Download,
  Share,
  FileCopy,
  Folder,
  Schedule,
  Person,
  Menu as MenuIcon,
  ViewModule,
} from '@mui/icons-material';

import { useCanvasStore } from '../../stores/canvasStore';

const ProjectManager = () => {
  const navigate = useNavigate();
  const { 
    projects = [], 
    newProject, 
    loadProject, 
    saveProject, 
    deleteProject, 
    duplicateProject, 
    exportProject,
    loadAllProjects
  } = useCanvasStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastModified');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load projects from API on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        console.log('Loading projects from API...');
        await loadAllProjects();
        console.log('Projects loaded, current projects:', projects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, [loadAllProjects]);

  // Debug log when projects change
  useEffect(() => {
    console.log('Projects updated:', projects);
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastModified':
        default:
          return new Date(b.lastModified) - new Date(a.lastModified);
      }
    });

  const handleMenuOpen = (event, project) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProject(null);
  };

  const handleNewProject = () => {
    newProject();
    navigate('/editor');
  };

  const handleOpenProject = (project) => {
    loadProject(project.id);
    navigate('/editor');
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleDuplicateProject = () => {
    if (selectedProject) {
      duplicateProject(selectedProject.id);
      handleMenuClose();
    }
  };

  const handleExportProject = () => {
    if (selectedProject) {
      exportProject(selectedProject.id);
      handleMenuClose();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProjectPreview = (project) => {
    // Generate a simple preview based on elements
    const elementCount = project.componentCount || project.elements?.length || 0;
    const elementTypes = [...new Set(project.elements?.map(el => el.type) || [])];
    
    return {
      elementCount,
      elementTypes: elementTypes.slice(0, 3), // Show first 3 types
    };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Project Manager
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your design projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={handleNewProject}
        >
          Create New Project
        </Button>
      </Box>

      {/* Toolbar */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              select
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
            >
              <MenuItem value="lastModified">Last Modified</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              select
              label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Projects</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <IconButton 
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
                aria-label="list view"
                data-testid="list-view-button"
              >
                <MenuIcon />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                aria-label="grid view"
                data-testid="grid-view-button"
              >
                <ViewModule />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Content */}
      <div data-testid={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading projects...</Typography>
        </Box>
      ) : filteredProjects.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => {
            const preview = getProjectPreview(project);
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleOpenProject(project)}
                >
                  {/* Project Thumbnail */}
                  <Box
                    sx={{
                      height: 160,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Folder sx={{ fontSize: 60, color: 'grey.400' }} />
                    
                    {/* Element count overlay */}
                    <Chip
                      label={`${project.componentCount || 0} components`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
                        {project.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, project);
                        }}
                        sx={{ mt: -0.5 }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(project.lastModified)}
                      </Typography>
                      <Chip
                        label={project.status || 'DRAFT'}
                        size="small"
                        color={
                          project.status === 'PUBLISHED' ? 'success' :
                          project.status === 'DRAFT' ? 'warning' :
                          project.status === 'active' ? 'success' :
                          project.status === 'completed' ? 'info' : 'default'
                        }
                        sx={{ ml: 'auto' }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {project.componentCount || 0} components
                    </Typography>

                    {/* Element types preview */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {preview.elementTypes.map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      ))}
                      {preview.elementTypes.length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Empty project
                        </Typography>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project);
                      }}
                    >
                      Open
                    </Button>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, project);
                      }}
                      aria-label="more actions"
                    >
                      <MoreVert />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        // Empty state
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Folder sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first project to get started with the canvas editor
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleNewProject}
          >
            Create New Project
          </Button>
        </Box>
      )}
      </div>

      {/* Project Statistics */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Project Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{projects.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Projects</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{projects.filter(p => p.status === 'active').length}</Typography>
              <Typography variant="body2" color="text.secondary">Active Projects</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Button for quick new project */}
      {projects.length > 0 && (
        <Fab
          color="primary"
          aria-label="add project"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={handleNewProject}
        >
          <Add />
        </Fab>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleOpenProject(selectedProject);
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 1 }} />
          Open
        </MenuItem>
        <MenuItem onClick={handleDuplicateProject}>
          <FileCopy sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleExportProject}>
          <Download sx={{ mr: 1 }} />
          Export
        </MenuItem>
        <MenuItem
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProject} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectManager;
