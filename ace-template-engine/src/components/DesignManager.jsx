import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CloudUpload as SaveIcon,
  Download as ExportIcon,
  Public as PublicIcon,
  Lock as PrivateIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import designApi from '../services/designApi';

const DesignManager = ({ onDesignSelect, onNewDesign }) => {
  // State management
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  
  // Form states
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [newDesign, setNewDesign] = useState({
    name: '',
    description: '',
    category: '',
    tags: [],
    isPublic: false,
    canvasConfig: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      gridSize: 20,
      showGrid: true,
      zoomLevel: 100,
      orientation: 'landscape'
    },
    themeSettings: {
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 'normal',
      borderRadius: '4px',
      spacing: '8px',
      shadowStyle: '0 2px 4px rgba(0,0,0,0.1)'
    },
    metadata: {
      category: 'web',
      difficulty: 'beginner',
      requiredFeatures: [],
      targetPlatform: 'web'
    }
  });
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: null, end: null });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Categories and status options
  const categories = ['web', 'mobile', 'dashboard', 'landing-page', 'form', 'portfolio', 'blog', 'e-commerce'];
  const statusOptions = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'UNDER_REVIEW'];
  const difficultyLevels = ['beginner', 'intermediate', 'advanced'];

  // Load designs on component mount
  useEffect(() => {
    loadDesigns();
  }, [page, pageSize]);

  // Load designs from backend
  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await designApi.getAllDesigns({
        paginated: true,
        page,
        size: pageSize,
        sortBy: 'updatedAt',
        sortDirection: 'desc'
      });
      
      setDesigns(response.content || response);
      setTotalCount(response.totalElements || response.length || 0);
    } catch (err) {
      setError('Failed to load designs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDesigns();
      return;
    }

    try {
      setLoading(true);
      const results = await designApi.searchDesigns(searchTerm);
      setDesigns(results);
      setTotalCount(results.length);
    } catch (err) {
      setError('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle filtering
  const handleFilter = async () => {
    try {
      setLoading(true);
      let results = [];

      if (filterStatus !== 'all') {
        results = await designApi.getDesignsByStatus(filterStatus);
      } else if (filterCategory !== 'all') {
        results = await designApi.getDesignsByCategory(filterCategory);
      } else if (dateFilter.start && dateFilter.end) {
        results = await designApi.getDesignsCreatedBetween(dateFilter.start, dateFilter.end);
      } else {
        loadDesigns();
        return;
      }

      setDesigns(results);
      setTotalCount(results.length);
    } catch (err) {
      setError('Filtering failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new design
  const handleCreateDesign = async () => {
    try {
      setLoading(true);
      const createdDesign = await designApi.createDesign(newDesign, 'current-user');
      setDesigns(prev => [createdDesign, ...prev]);
      setCreateDialogOpen(false);
      setSuccess('Design created successfully!');
      resetNewDesign();
      
      if (onNewDesign) {
        onNewDesign(createdDesign);
      }
    } catch (err) {
      setError('Failed to create design: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update design
  const handleUpdateDesign = async () => {
    try {
      setLoading(true);
      const updatedDesign = await designApi.updateDesign(selectedDesign.id, selectedDesign, 'current-user');
      setDesigns(prev => prev.map(d => d.id === updatedDesign.id ? updatedDesign : d));
      setEditDialogOpen(false);
      setSuccess('Design updated successfully!');
    } catch (err) {
      setError('Failed to update design: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete design
  const handleDeleteDesign = async (designId) => {
    try {
      setLoading(true);
      await designApi.deleteDesign(designId);
      setDesigns(prev => prev.filter(d => d.id !== designId));
      setDeleteDialogOpen(false);
      setSuccess('Design deleted successfully!');
    } catch (err) {
      setError('Failed to delete design: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clone design
  const handleCloneDesign = async (designId, newName) => {
    try {
      setLoading(true);
      const clonedDesign = await designApi.cloneDesign(designId, newName, 'current-user');
      setDesigns(prev => [clonedDesign, ...prev]);
      setCloneDialogOpen(false);
      setSuccess('Design cloned successfully!');
    } catch (err) {
      setError('Failed to clone design: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Export design
  const handleExportDesign = async (designId, designName) => {
    try {
      const blob = await designApi.exportDesign(designId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${designName}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Design exported successfully!');
    } catch (err) {
      setError('Failed to export design: ' + err.message);
    }
  };

  const resetNewDesign = () => {
    setNewDesign({
      name: '',
      description: '',
      category: '',
      tags: [],
      isPublic: false,
      canvasConfig: {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        gridSize: 20,
        showGrid: true,
        zoomLevel: 100,
        orientation: 'landscape'
      },
      themeSettings: {
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: 'normal',
        borderRadius: '4px',
        spacing: '8px',
        shadowStyle: '0 2px 4px rgba(0,0,0,0.1)'
      },
      metadata: {
        category: 'web',
        difficulty: 'beginner',
        requiredFeatures: [],
        targetPlatform: 'web'
      }
    });
  };

  // DataGrid columns
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.row.isPublic ? <PublicIcon fontSize="small" /> : <PrivateIcon fontSize="small" />}
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value || 'No description'}>
          <Typography variant="body2" noWrap>
            {params.value || 'No description'}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={
            params.value === 'PUBLISHED' ? 'success' :
            params.value === 'DRAFT' ? 'default' :
            params.value === 'UNDER_REVIEW' ? 'warning' : 'error'
          }
        />
      )
    },
    {
      field: 'metadata',
      headerName: 'Category',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value?.category || 'uncategorized'} 
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {(params.value || []).slice(0, 2).map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
          {(params.value?.length || 0) > 2 && (
            <Chip label={`+${params.value.length - 2}`} size="small" variant="outlined" />
          )}
        </Box>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()} {new Date(params.value).toLocaleTimeString()}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Open Design">
            <IconButton 
              size="small" 
              onClick={() => onDesignSelect && onDesignSelect(params.row)}
              color="primary"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedDesign(params.row);
                setEditDialogOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clone">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedDesign(params.row);
                setCloneDialogOpen(true);
              }}
            >
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton 
              size="small" 
              onClick={() => handleExportDesign(params.row.id, params.row.name)}
            >
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedDesign(params.row);
                setDeleteDialogOpen(true);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Design Manager
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={loading}
          >
            New Design
          </Button>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <DateTimePicker
                  label="Start Date"
                  value={dateFilter.start}
                  onChange={(date) => setDateFilter(prev => ({ ...prev, start: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DateTimePicker
                  label="End Date"
                  value={dateFilter.end}
                  onChange={(date) => setDateFilter(prev => ({ ...prev, end: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilter}
              >
                Apply Filters
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setDateFilter({ start: null, end: null });
                  loadDesigns();
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Designs Table */}
        <Card>
          <CardContent>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
            
            {!loading && (
              <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={designs}
                  columns={columns}
                  pageSize={pageSize}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  page={page}
                  onPageChange={(newPage) => setPage(newPage)}
                  rowCount={totalCount}
                  pagination
                  paginationMode="server"
                  disableSelectionOnClick
                  checkboxSelection
                  getRowId={(row) => row.id}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Create Design Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Design Name"
                  value={newDesign.name}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newDesign.metadata.category}
                    label="Category"
                    onChange={(e) => setNewDesign(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, category: e.target.value }
                    }))}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newDesign.description}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Canvas Width"
                  type="number"
                  value={newDesign.canvasConfig.width}
                  onChange={(e) => setNewDesign(prev => ({ 
                    ...prev, 
                    canvasConfig: { ...prev.canvasConfig, width: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Canvas Height"
                  type="number"
                  value={newDesign.canvasConfig.height}
                  onChange={(e) => setNewDesign(prev => ({ 
                    ...prev, 
                    canvasConfig: { ...prev.canvasConfig, height: parseInt(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  type="color"
                  value={newDesign.canvasConfig.backgroundColor}
                  onChange={(e) => setNewDesign(prev => ({ 
                    ...prev, 
                    canvasConfig: { ...prev.canvasConfig, backgroundColor: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={newDesign.metadata.difficulty}
                    label="Difficulty"
                    onChange={(e) => setNewDesign(prev => ({ 
                      ...prev, 
                      metadata: { ...prev.metadata, difficulty: e.target.value }
                    }))}
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={['responsive', 'mobile-friendly', 'dark-mode', 'animations', 'interactive']}
                  value={newDesign.tags || []}
                  onChange={(event, newValue) => {
                    setNewDesign(prev => ({ ...prev, tags: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newDesign.isPublic}
                      onChange={(e) => setNewDesign(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                  }
                  label="Make this design public"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateDesign} 
              variant="contained"
              disabled={!newDesign.name.trim() || loading}
            >
              Create Design
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Design Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Design</DialogTitle>
          <DialogContent>
            {selectedDesign && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Design Name"
                    value={selectedDesign.name}
                    onChange={(e) => setSelectedDesign(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedDesign.status}
                      label="Status"
                      onChange={(e) => setSelectedDesign(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={selectedDesign.description || ''}
                    onChange={(e) => setSelectedDesign(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedDesign.isPublic}
                        onChange={(e) => setSelectedDesign(prev => ({ ...prev, isPublic: e.target.checked }))}
                      />
                    }
                    label="Make this design public"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateDesign} 
              variant="contained"
              disabled={loading}
            >
              Update Design
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Design</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedDesign?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleDeleteDesign(selectedDesign?.id)} 
              color="error"
              variant="contained"
              disabled={loading}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clone Design Dialog */}
        <Dialog open={cloneDialogOpen} onClose={() => setCloneDialogOpen(false)}>
          <DialogTitle>Clone Design</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="New Design Name"
              defaultValue={selectedDesign ? `${selectedDesign.name} - Copy` : ''}
              onChange={(e) => setSelectedDesign(prev => ({ ...prev, cloneName: e.target.value }))}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleCloneDesign(selectedDesign?.id, selectedDesign?.cloneName)} 
              variant="contained"
              disabled={loading}
            >
              Clone Design
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default DesignManager;
