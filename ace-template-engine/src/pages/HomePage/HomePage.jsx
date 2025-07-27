import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  CollectionsBookmark,
  FolderOpen,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const recentProjects = [
    { id: 1, name: 'Landing Page Template', lastModified: '2 hours ago', type: 'Web Page' },
    { id: 2, name: 'Email Newsletter', lastModified: '1 day ago', type: 'Email' },
    { id: 3, name: 'Product Showcase', lastModified: '3 days ago', type: 'Portfolio' },
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Start creating with our advanced editor',
      icon: <Add fontSize="large" />,
      action: () => navigate('/editor'),
      color: 'primary',
    },
    {
      title: 'Browse Templates',
      description: 'Choose from pre-made designs',
      icon: <CollectionsBookmark fontSize="large" />,
      action: () => navigate('/templates'),
      color: 'secondary',
    },
    {
      title: 'Open Project',
      description: 'Continue working on existing project',
      icon: <FolderOpen fontSize="large" />,
      action: () => navigate('/projects'),
      color: 'success',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Ace Template Engine
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Create stunning designs with our powerful canvas-based editor
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Edit />}
          onClick={() => navigate('/editor')}
          sx={{ mr: 2 }}
        >
          Start Creating
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<CollectionsBookmark />}
          onClick={() => navigate('/templates')}
        >
          Browse Templates
        </Button>
      </Box>

      {/* Quick Actions */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', py: 4, position: 'relative' }}>
                {action.isNew && (
                  <Chip
                    label="NEW"
                    color="warning"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontWeight: 'bold',
                    }}
                  />
                )}
                <Box
                  sx={{
                    color: `${action.color}.main`,
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Projects */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Schedule sx={{ mr: 1 }} />
              <Typography variant="h5">Recent Projects</Typography>
            </Box>
            {recentProjects.length > 0 ? (
              <Grid container spacing={2}>
                {recentProjects.map((project) => (
                  <Grid item xs={12} key={project.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Last modified: {project.lastModified}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={project.type} size="small" color="primary" variant="outlined" />
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => navigate(`/editor/${project.id}`)}
                            >
                              Edit
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent projects. Start creating to see them here!
                </Typography>
              </Box>
            )}
            <CardActions sx={{ justifyContent: 'center', pt: 2 }}>
              <Button onClick={() => navigate('/projects')}>View All Projects</Button>
            </CardActions>
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">Statistics</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Total Projects:</Typography>
              <Typography variant="body2" fontWeight="bold">12</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Templates Used:</Typography>
              <Typography variant="body2" fontWeight="bold">8</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">This Month:</Typography>
              <Typography variant="body2" fontWeight="bold">5</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Drag-and-drop interface, rich component library, export options, and real-time collaboration.
            </Typography>
            <Button variant="outlined" size="small" fullWidth>
              Learn More
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
