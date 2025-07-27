import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Autocomplete,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
  TableChart as TableChartIcon,
  Code as CodeIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import designApi from '../services/designApi';

const DataQueryManager = ({ component, onPropertyChange, designId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [queryState, setQueryState] = useState({
    dataSource: 'designs',
    query: '',
    filters: [],
    sorting: { field: 'updatedAt', direction: 'desc' },
    pagination: { page: 0, size: 10 },
    columns: [],
    results: [],
    loading: false,
    error: null,
    previewMode: false
  });

  const [savedQueries, setSavedQueries] = useState([]);
  const [queryDialog, setQueryDialog] = useState(false);
  const [newQuery, setNewQuery] = useState({ name: '', query: '', description: '' });

  // Data source options
  const dataSources = [
    { value: 'designs', label: 'Designs Collection', endpoint: '/designs' },
    { value: 'projects', label: 'Projects Collection', endpoint: '/projects' },
    { value: 'components', label: 'Components Data', endpoint: '/component-data' },
    { value: 'datasources', label: 'Data Sources', endpoint: '/datasources' },
    { value: 'custom', label: 'Custom Query', endpoint: '/custom' }
  ];

  // Predefined query templates
  const queryTemplates = {
    allDesigns: {
      name: 'All Designs',
      query: 'getAllDesigns',
      description: 'Fetch all designs with pagination',
      params: { paginated: true, page: 0, size: 10 }
    },
    publicDesigns: {
      name: 'Public Designs',
      query: 'getPublicDesigns',
      description: 'Fetch only public designs',
      params: {}
    },
    recentDesigns: {
      name: 'Recent Designs',
      query: 'getDesignsUpdatedAfter',
      description: 'Designs updated in last 7 days',
      params: { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    },
    designsByCategory: {
      name: 'Designs by Category',
      query: 'getDesignsByCategory',
      description: 'Filter designs by category',
      params: { category: 'web' }
    },
    designsByStatus: {
      name: 'Designs by Status',
      query: 'getDesignsByStatus',
      description: 'Filter designs by status',
      params: { status: 'PUBLISHED' }
    }
  };

  // Initialize component with existing data configuration
  useEffect(() => {
    if (component?.properties?.dataConfig) {
      setQueryState(prev => ({
        ...prev,
        ...component.properties.dataConfig
      }));
    }
  }, [component]);

  // Execute query
  const executeQuery = async () => {
    try {
      setQueryState(prev => ({ ...prev, loading: true, error: null }));

      let results = [];
      
      switch (queryState.dataSource) {
        case 'designs':
          results = await executeDesignQuery();
          break;
        case 'projects':
          results = await executeDesignQuery(); // Same as designs since they're merged
          break;
        case 'components':
          results = await executeComponentQuery();
          break;
        default:
          results = await executeCustomQuery();
      }

      // Generate columns if not already set
      if (results.length > 0 && queryState.columns.length === 0) {
        const autoColumns = generateColumnsFromData(results[0]);
        setQueryState(prev => ({ ...prev, columns: autoColumns }));
      }

      setQueryState(prev => ({ ...prev, results, loading: false }));
      
      // Update component properties
      updateComponentDataConfig({
        ...queryState,
        results,
        lastExecuted: new Date().toISOString()
      });

    } catch (error) {
      setQueryState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const executeDesignQuery = async () => {
    const { query, pagination, sorting } = queryState;
    
    switch (query) {
      case 'getAllDesigns':
        return await designApi.getAllDesigns({
          paginated: true,
          page: pagination.page,
          size: pagination.size,
          sortBy: sorting.field,
          sortDirection: sorting.direction
        });
      case 'getPublicDesigns':
        return await designApi.getPublicDesigns();
      case 'getDesignsUpdatedAfter':
        const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return await designApi.getDesignsUpdatedAfter(date);
      case 'getDesignsByCategory':
        return await designApi.getDesignsByCategory('web');
      case 'getDesignsByStatus':
        return await designApi.getDesignsByStatus('PUBLISHED');
      default:
        return await designApi.getAllDesigns();
    }
  };

  const executeComponentQuery = async () => {
    // Implementation for components query
    return [];
  };

  const executeCustomQuery = async () => {
    // Implementation for custom query
    return [];
  };

  const generateColumnsFromData = (sampleRow) => {
    return Object.keys(sampleRow).map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: getColumnWidth(key, sampleRow[key]),
      type: getColumnType(sampleRow[key]),
      visible: true
    }));
  };

  const getColumnWidth = (key, value) => {
    if (key === 'id') return 100;
    if (key === 'name' || key === 'title') return 200;
    if (key === 'description') return 300;
    if (typeof value === 'boolean') return 100;
    if (typeof value === 'number') return 120;
    if (key.includes('date') || key.includes('time')) return 180;
    return 150;
  };

  const getColumnType = (value) => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value))) return 'dateTime';
    return 'string';
  };

  const updateComponentDataConfig = (dataConfig) => {
    if (onPropertyChange) {
      onPropertyChange('dataConfig', dataConfig);
    }
  };

  const saveQuery = () => {
    const query = {
      ...newQuery,
      id: Date.now().toString(),
      config: queryState,
      createdAt: new Date().toISOString()
    };
    
    setSavedQueries(prev => [...prev, query]);
    setQueryDialog(false);
    setNewQuery({ name: '', query: '', description: '' });
  };

  const loadQuery = (queryConfig) => {
    setQueryState(prev => ({ ...prev, ...queryConfig }));
  };

  const applyTemplate = (template) => {
    setQueryState(prev => ({
      ...prev,
      query: template.query,
      ...template.params
    }));
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`data-tabpanel-${index}`}
      aria-labelledby={`data-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon />
        Data Query Manager
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Query Builder" />
        <Tab label="Results" />
        <Tab label="Templates" />
        <Tab label="Settings" />
      </Tabs>

      {/* Query Builder Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={queryState.dataSource}
                label="Data Source"
                onChange={(e) => setQueryState(prev => ({ ...prev, dataSource: e.target.value }))}
              >
                {dataSources.map((source) => (
                  <MenuItem key={source.value} value={source.value}>
                    {source.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Query Method"
              value={queryState.query}
              onChange={(e) => setQueryState(prev => ({ ...prev, query: e.target.value }))}
              placeholder="e.g., getAllDesigns, getPublicDesigns"
              helperText="Enter the API method name or custom query"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Page Size"
              type="number"
              value={queryState.pagination.size}
              onChange={(e) => setQueryState(prev => ({
                ...prev,
                pagination: { ...prev.pagination, size: parseInt(e.target.value) }
              }))}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Page Number"
              type="number"
              value={queryState.pagination.page}
              onChange={(e) => setQueryState(prev => ({
                ...prev,
                pagination: { ...prev.pagination, page: parseInt(e.target.value) }
              }))}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Sort Field"
              value={queryState.sorting.field}
              onChange={(e) => setQueryState(prev => ({
                ...prev,
                sorting: { ...prev.sorting, field: e.target.value }
              }))}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Sort Direction</InputLabel>
              <Select
                value={queryState.sorting.direction}
                label="Sort Direction"
                onChange={(e) => setQueryState(prev => ({
                  ...prev,
                  sorting: { ...prev.sorting, direction: e.target.value }
                }))}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={executeQuery}
                disabled={queryState.loading}
              >
                Execute Query
              </Button>
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => setQueryDialog(true)}
              >
                Save Query
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setQueryState(prev => ({ ...prev, results: [] }))}
              >
                Clear Results
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Results Tab */}
      <TabPanel value={activeTab} index={1}>
        {queryState.loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {queryState.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {queryState.error}
          </Alert>
        )}

        {queryState.results.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Query Results ({queryState.results.length} rows)
            </Typography>
            
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={queryState.results}
                columns={queryState.columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.id || Math.random()}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Column Configuration
              </Typography>
              <Grid container spacing={1}>
                {queryState.columns.map((column, index) => (
                  <Grid item xs={6} md={4} key={column.field}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={column.visible}
                          onChange={(e) => {
                            const newColumns = [...queryState.columns];
                            newColumns[index].visible = e.target.checked;
                            setQueryState(prev => ({ ...prev, columns: newColumns }));
                          }}
                        />
                      }
                      label={column.headerName}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {!queryState.loading && !queryState.error && queryState.results.length === 0 && (
          <Alert severity="info">
            No results. Click "Execute Query" to run your query.
          </Alert>
        )}
      </TabPanel>

      {/* Templates Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="subtitle1" gutterBottom>
          Query Templates
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(queryTemplates).map(([key, template]) => (
            <Grid item xs={12} md={6} key={key}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {template.description}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => applyTemplate(template)}
                >
                  Apply Template
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Saved Queries
        </Typography>
        {savedQueries.length === 0 ? (
          <Alert severity="info">No saved queries yet.</Alert>
        ) : (
          <Grid container spacing={2}>
            {savedQueries.map((query) => (
              <Grid item xs={12} md={6} key={query.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">{query.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {query.description}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => loadQuery(query.config)}
                  >
                    Load Query
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Settings Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="subtitle1" gutterBottom>
          Data Configuration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={queryState.previewMode}
                  onChange={(e) => setQueryState(prev => ({ ...prev, previewMode: e.target.checked }))}
                />
              }
              label="Preview Mode (Show sample data)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Auto-refresh Interval (seconds)"
              type="number"
              helperText="Set to 0 to disable auto-refresh"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch />}
              label="Cache results"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch />}
              label="Show loading indicator"
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Save Query Dialog */}
      <Dialog open={queryDialog} onClose={() => setQueryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Query</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Query Name"
                value={newQuery.name}
                onChange={(e) => setNewQuery(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newQuery.description}
                onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQueryDialog(false)}>Cancel</Button>
          <Button 
            onClick={saveQuery} 
            variant="contained"
            disabled={!newQuery.name.trim()}
          >
            Save Query
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataQueryManager;
