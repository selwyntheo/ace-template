import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Badge,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  Rating,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab
} from '@mui/material';
import {
  ExpandMore,
  Favorite,
  Share,
  Settings,
  Edit,
  Add,
  Remove,
  PlayArrow,
  Pause,
  Stop,
  Home,
  Dashboard,
  Person,
  Notifications,
  Search,
  Menu,
  Close,
  ArrowBack,
  ArrowForward,
  MoreVert,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Download,
  Upload,
  Print,
  Email,
  Phone,
  LocationOn,
  Delete,
  ViewModule
} from '@mui/icons-material';

// Advanced Component Previews
export const AdvancedComponentPreviews = {
  // Form Components
  advancedInput: {
    component: (props) => (
      <TextField
        {...props}
        label="Advanced Input"
        variant="outlined"
        placeholder="Type something..."
        helperText="This is helper text"
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
    ),
    defaultProps: {
      width: 250,
      height: 80,
      properties: {
        label: 'Advanced Input',
        placeholder: 'Type something...',
        helperText: 'This is helper text',
        startIcon: 'search',
        endIcon: '',
        variant: 'outlined',
        size: 'medium',
        required: false,
        disabled: false,
        error: false,
        multiline: false,
        type: 'text'
      }
    }
  },

  searchField: {
    component: (props) => (
      <TextField
        {...props}
        label="Search"
        variant="outlined"
        placeholder="Search..."
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          endAdornment: <IconButton size="small"><Close /></IconButton>
        }}
      />
    ),
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        placeholder: 'Search...',
        label: 'Search',
        clearable: true,
        searchIcon: true
      }
    }
  },

  autocomplete: {
    component: (props) => (
      <Autocomplete
        {...props}
        options={['Option 1', 'Option 2', 'Option 3']}
        renderInput={(params) => (
          <TextField {...params} label="Autocomplete" variant="outlined" />
        )}
      />
    ),
    defaultProps: {
      width: 250,
      height: 60,
      properties: {
        label: 'Autocomplete',
        options: ['Option 1', 'Option 2', 'Option 3'],
        multiple: false,
        freeSolo: false,
        disabled: false
      }
    }
  },

  // Navigation Components
  breadcrumbNav: {
    component: (props) => (
      <Breadcrumbs {...props}>
        <Link underline="hover" color="inherit" href="#">
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#">
          Category
        </Link>
        <Typography color="text.primary">Current Page</Typography>
      </Breadcrumbs>
    ),
    defaultProps: {
      width: 300,
      height: 40,
      properties: {
        items: [
          { label: 'Home', href: '#', icon: 'home' },
          { label: 'Category', href: '#' },
          { label: 'Current Page' }
        ]
      }
    }
  },

  stepperNav: {
    component: (props) => (
      <Stepper activeStep={1} {...props}>
        <Step><StepLabel>Step 1</StepLabel></Step>
        <Step><StepLabel>Step 2</StepLabel></Step>
        <Step><StepLabel>Step 3</StepLabel></Step>
      </Stepper>
    ),
    defaultProps: {
      width: 400,
      height: 80,
      properties: {
        activeStep: 1,
        steps: ['Step 1', 'Step 2', 'Step 3'],
        orientation: 'horizontal'
      }
    }
  },

  // Display Components
  userCard: {
    component: (props) => (
      <Card {...props} sx={{ maxWidth: 300 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>}
          action={<IconButton><MoreVert /></IconButton>}
          title="User Name"
          subheader="user@example.com"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This is a user card component with avatar, actions, and content.
          </Typography>
        </CardContent>
      </Card>
    ),
    defaultProps: {
      width: 300,
      height: 180,
      properties: {
        title: 'User Name',
        subtitle: 'user@example.com',
        content: 'This is a user card component with avatar, actions, and content.',
        avatar: 'U',
        avatarColor: 'primary'
      }
    }
  },

  statsCard: {
    component: (props) => (
      <Card {...props}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                1,234
              </Typography>
              <Typography variant="body2" color="success.main">
                +12% from last month
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Person />
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    ),
    defaultProps: {
      width: 280,
      height: 140,
      properties: {
        title: 'Total Users',
        value: '1,234',
        change: '+12%',
        changeColor: 'success',
        icon: 'person'
      }
    }
  },

  // Interactive Components
  ratingComponent: {
    component: (props) => (
      <Box {...props}>
        <Typography component="legend">Rating</Typography>
        <Rating value={4} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          4 out of 5 stars
        </Typography>
      </Box>
    ),
    defaultProps: {
      width: 200,
      height: 80,
      properties: {
        value: 4,
        max: 5,
        precision: 1,
        readOnly: false,
        label: 'Rating'
      }
    }
  },

  toggleGroup: {
    component: (props) => (
      <Box {...props}>
        <Typography variant="body2" gutterBottom>View Options</Typography>
        <ToggleButtonGroup value="grid" exclusive>
          <ToggleButton value="list">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="grid">
            <Dashboard />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    ),
    defaultProps: {
      width: 150,
      height: 80,
      properties: {
        options: [
          { value: 'list', icon: 'view_module' },
          { value: 'grid', icon: 'dashboard' }
        ],
        value: 'grid',
        exclusive: true
      }
    }
  },

  // Feedback Components
  progressBar: {
    component: (props) => (
      <Box {...props}>
        <Typography variant="body2" gutterBottom>
          Progress: 65%
        </Typography>
        <LinearProgress variant="determinate" value={65} />
      </Box>
    ),
    defaultProps: {
      width: 250,
      height: 50,
      properties: {
        value: 65,
        variant: 'determinate',
        color: 'primary',
        showLabel: true
      }
    }
  },

  loadingSpinner: {
    component: (props) => (
      <Box {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2">Loading...</Typography>
      </Box>
    ),
    defaultProps: {
      width: 150,
      height: 40,
      properties: {
        size: 24,
        color: 'primary',
        showLabel: true,
        label: 'Loading...'
      }
    }
  },

  // Action Components
  actionButtons: {
    component: (props) => (
      <Box {...props} sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" startIcon={<Add />} size="small">
          Add
        </Button>
        <Button variant="outlined" startIcon={<Edit />} size="small">
          Edit
        </Button>
        <IconButton color="error" size="small">
          <Delete />
        </IconButton>
      </Box>
    ),
    defaultProps: {
      width: 200,
      height: 40,
      properties: {
        buttons: [
          { label: 'Add', variant: 'contained', icon: 'add' },
          { label: 'Edit', variant: 'outlined', icon: 'edit' },
          { icon: 'delete', variant: 'icon', color: 'error' }
        ]
      }
    }
  },

  floatingActionButton: {
    component: (props) => (
      <Fab {...props} color="primary" aria-label="add">
        <Add />
      </Fab>
    ),
    defaultProps: {
      width: 56,
      height: 56,
      properties: {
        icon: 'add',
        color: 'primary',
        size: 'medium',
        variant: 'circular'
      }
    }
  },

  // Data Table Component
  enhancedTable: {
    component: (props) => (
      <Card {...props}>
        <CardHeader 
          title="Enhanced Data Table" 
          subheader="Interactive table with data operations"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Advanced table component with sorting, filtering, pagination, and CRUD operations.
            Connects to backend APIs for real-time data management.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip label="Sortable" size="small" />
            <Chip label="Filterable" size="small" />
            <Chip label="Editable" size="small" />
            <Chip label="API Connected" size="small" color="primary" />
          </Box>
        </CardContent>
      </Card>
    ),
    defaultProps: {
      width: 400,
      height: 300,
      properties: {
        title: 'Data Table',
        dataSource: 'designs',
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        enableEditing: true,
        pageSize: 10,
        columns: [],
        query: '',
        autoRefresh: false
      }
    }
  }
};

// Component Library Categories with Advanced Components
export const advancedComponentCategories = {
  'Advanced Forms': [
    'advancedInput',
    'searchField', 
    'autocomplete'
  ],
  'Navigation': [
    'breadcrumbNav',
    'stepperNav'
  ],
  'Data Display': [
    'userCard',
    'statsCard'
  ],
  'Interactive': [
    'ratingComponent',
    'toggleGroup'
  ],
  'Feedback': [
    'progressBar',
    'loadingSpinner'
  ],
  'Actions': [
    'actionButtons',
    'floatingActionButton'
  ],
  'Data Management': [
    'enhancedTable'
  ]
};

export default AdvancedComponentPreviews;
