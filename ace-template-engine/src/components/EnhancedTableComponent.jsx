import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  ListItemText,
  OutlinedInput,
  Switch,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Save,
  Settings,
  TableChart,
  Visibility,
  Code,
  Download,
  FilterList,
  Sort,
  ViewColumn,
  SelectAll,
  CheckBoxOutlineBlank,
  CheckBox
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import designApi from '../services/designApi';

const EnhancedTableComponent = ({ 
  component, 
  onPropertyChange, 
  designId,
  isEditMode = true,
  onSave,
  onReload 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [dataState, setDataState] = useState({
    source: 'designs',
    query: '',
    results: [],
    columns: [],
    availableColumns: [], // All available columns from data
    selectedColumns: [], // User-selected columns to display
    loading: false,
    error: null,
    lastFetched: null,
    totalRows: 0,
    page: 0,
    pageSize: 10
  });

  const [queryDialog, setQueryDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [columnSelectionDialog, setColumnSelectionDialog] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    autoRefresh: false,
    refreshInterval: 30000,
    enableFiltering: true,
    enableSorting: true,
    enablePagination: true,
    rowSelection: 'single',
    columnSelection: true, // Enable column selection feature
    showAllColumns: true // Show all columns by default
  });

  // Data source configurations - Updated to use generic MongoDB API
  const dataSources = [
    { 
      value: 'designs', 
      label: 'Designs Collection', 
      endpoint: '/designs',
      description: 'All design data from the database',
      useGenericApi: false
    },
    { 
      value: 'projects', 
      label: 'Projects Collection', 
      endpoint: '/projects',
      description: 'Project data (alias for designs)',
      useGenericApi: false
    },
    { 
      value: 'account_balances', 
      label: 'Account Balances', 
      endpoint: '/mongo/collections/account_balances/all',
      description: 'Financial account balance data',
      useGenericApi: true
    },
    { 
      value: 'chart_of_accounts', 
      label: 'Chart of Accounts', 
      endpoint: '/mongo/collections/chart_of_accounts/all',
      description: 'Chart of accounts data',
      useGenericApi: true
    },
    { 
      value: 'distributions', 
      label: 'Distributions', 
      endpoint: '/mongo/collections/distributions/all',
      description: 'Distribution data',
      useGenericApi: true
    },
    { 
      value: 'fund_info', 
      label: 'Fund Information', 
      endpoint: '/mongo/collections/fund_info/all',
      description: 'Fund information data',
      useGenericApi: true
    },
    { 
      value: 'journal_entries', 
      label: 'Journal Entries', 
      endpoint: '/mongo/collections/journal_entries/all',
      description: 'Journal entries data',
      useGenericApi: true
    },
    { 
      value: 'nav_history', 
      label: 'NAV History', 
      endpoint: '/mongo/collections/nav_history/all',
      description: 'Net Asset Value history data',
      useGenericApi: true
    },
    { 
      value: 'share_transactions', 
      label: 'Share Transactions', 
      endpoint: '/mongo/collections/share_transactions/all',
      description: 'Share transaction data',
      useGenericApi: true
    },
    { 
      value: 'custom', 
      label: 'Custom Query', 
      endpoint: '/custom',
      description: 'Execute custom database queries',
      useGenericApi: false
    }
  ];

  // Initialize component data from saved configuration
  useEffect(() => {
    if (component?.properties?.dataConfig) {
      setDataState(prev => ({
        ...prev,
        ...component.properties.dataConfig
      }));
    }
    if (component?.properties?.advancedOptions) {
      setAdvancedOptions(prev => ({
        ...prev,
        ...component.properties.advancedOptions
      }));
    }
  }, [component]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (advancedOptions.autoRefresh && advancedOptions.refreshInterval > 0) {
      interval = setInterval(() => {
        executeQuery();
      }, advancedOptions.refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [advancedOptions.autoRefresh, advancedOptions.refreshInterval]);

  // Execute query against backend
  const executeQuery = useCallback(async () => {
    setDataState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let results = [];
      let columns = [];
      
      switch (dataState.source) {
        case 'designs':
          results = await designApi.getAllDesigns();
          columns = generateColumnsFromData(results, 'designs');
          break;
          
        case 'projects':
          results = await designApi.getAllDesigns(); // Projects endpoint is alias
          columns = generateColumnsFromData(results, 'projects');
          break;
          
        case 'account_balances':
        case 'chart_of_accounts':
        case 'distributions':
        case 'fund_info':
        case 'journal_entries':
        case 'nav_history':
        case 'share_transactions':
          results = await fetchCollectionData(dataState.source);
          columns = generateColumnsFromData(results, 'collection');
          break;
          
        case 'custom':
          if (dataState.query.trim()) {
            // For demo, we'll execute predefined queries
            results = await executeCustomQuery(dataState.query);
            columns = generateColumnsFromData(results, 'custom');
          } else {
            throw new Error('Custom query is required');
          }
          break;
          
        default:
          throw new Error(`Unsupported data source: ${dataState.source}`);
      }

      const updatedDataState = {
        ...dataState,
        results,
        columns,
        loading: false,
        lastFetched: new Date().toISOString(),
        totalRows: results.length
      };

      setDataState(updatedDataState);
      
      // Update component properties
      if (onPropertyChange) {
        onPropertyChange('properties', {
          ...component.properties,
          dataConfig: updatedDataState
        });
      }
      
    } catch (error) {
      console.error('Query execution error:', error);
      setDataState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [dataState.source, dataState.query, component, onPropertyChange]);

  // Fetch data from MongoDB collections using generic API
  const fetchCollectionData = async (collectionName) => {
    try {
      const dataSource = dataSources.find(ds => ds.value === collectionName);
      if (!dataSource) {
        throw new Error(`Unknown collection: ${collectionName}`);
      }

      const response = await fetch(`http://localhost:8080/api${dataSource.endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'table-component-user'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (dataSource.useGenericApi) {
        // Generic API returns array directly for /all endpoints
        return Array.isArray(data) ? data : [data];
      } else {
        // Legacy endpoints and design/project APIs
        return Array.isArray(data) ? data : [data];
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      throw error;
    }
  };

  // Enhanced fetch function for paginated data
  const fetchCollectionDataPaginated = async (collectionName, options = {}) => {
    try {
      const { page = 0, limit = 100, sortBy, sortOrder = 'asc' } = options;
      const dataSource = dataSources.find(ds => ds.value === collectionName);
      
      if (!dataSource || !dataSource.useGenericApi) {
        // Fall back to simple fetch for non-generic APIs
        return await fetchCollectionData(collectionName);
      }

      const baseEndpoint = `/mongo/collections/${collectionName}`;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(sortBy && { sortBy }),
        sortOrder
      });

      const response = await fetch(`http://localhost:8080/api${baseEndpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'table-component-user'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        data: result.data || [],
        pagination: result.pagination || {},
        collection: result.collection
      };
    } catch (error) {
      console.error(`Error fetching paginated ${collectionName}:`, error);
      throw error;
    }
  };

  // Search function for collections
  const searchCollectionData = async (collectionName, searchCriteria, options = {}) => {
    try {
      const { page = 0, limit = 100 } = options;
      const dataSource = dataSources.find(ds => ds.value === collectionName);
      
      if (!dataSource || !dataSource.useGenericApi) {
        throw new Error(`Search not supported for ${collectionName}`);
      }

      const response = await fetch(`http://localhost:8080/api/mongo/collections/${collectionName}/search?page=${page}&limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'table-component-user'
        },
        body: JSON.stringify(searchCriteria)
      });

      if (!response.ok) {
        throw new Error(`Failed to search ${collectionName}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error searching ${collectionName}:`, error);
      throw error;
    }
  };

  // Generate columns from data structure
  const generateColumnsFromData = (data, type) => {
    if (!data || data.length === 0) return [];
    
    const sample = data[0];
    const columns = [];

    switch (type) {
      case 'designs':
      case 'projects':
        columns.push(
          { field: 'id', headerName: 'ID', width: 200, sortable: true },
          { 
            field: 'name', 
            headerName: 'Name', 
            width: 200, 
            sortable: true,
            editable: true
          },
          { 
            field: 'description', 
            headerName: 'Description', 
            width: 300, 
            sortable: true,
            editable: true
          },
          { field: 'version', headerName: 'Version', width: 100, sortable: true },
          { field: 'status', headerName: 'Status', width: 120, sortable: true },
          { 
            field: 'isPublic', 
            headerName: 'Public', 
            width: 100, 
            type: 'boolean',
            editable: true,
            renderCell: (params) => (
              <Chip 
                label={params.value ? 'Yes' : 'No'} 
                color={params.value ? 'success' : 'default'}
                size="small"
              />
            )
          },
          { 
            field: 'createdAt', 
            headerName: 'Created', 
            width: 150,
            type: 'dateTime',
            valueGetter: (params) => {
              if (Array.isArray(params.value)) {
                // Handle LocalDateTime array format from backend
                const [year, month, day, hour, minute, second] = params.value;
                return new Date(year, month - 1, day, hour, minute, second);
              }
              return new Date(params.value);
            }
          },
          { 
            field: 'components', 
            headerName: 'Components', 
            width: 120,
            valueGetter: (params) => params.value ? params.value.length : 0
          }
        );
        break;
        
      case 'collection':
        // Handle MongoDB collections with dynamic column generation
        Object.keys(sample).forEach(key => {
          const isEditableField = ['name', 'label', 'placeholder', 'description', 'title', 'text', 'accountName', 'fundName', 'symbol'].includes(key.toLowerCase());
          columns.push({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            width: key === 'id' || key === '_id' ? 200 : 150,
            sortable: true,
            editable: isEditableField,
            type: typeof sample[key] === 'number' ? 'number' : 
                  typeof sample[key] === 'boolean' ? 'boolean' : 
                  (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) ? 'dateTime' : 'string'
          });
        });
        break;
        
      default:
        // Auto-generate columns for any data structure
        Object.keys(sample).forEach(key => {
          columns.push({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
            sortable: true,
            editable: ['name', 'label', 'placeholder', 'description', 'title', 'text'].includes(key.toLowerCase())
          });
        });
    }

    // Store all available columns for selection
    setDataState(prev => ({
      ...prev,
      availableColumns: columns,
      selectedColumns: advancedOptions.showAllColumns ? columns.map(col => col.field) : []
    }));

    return columns;
  };

  // Get filtered columns based on user selection
  const getDisplayColumns = () => {
    if (!advancedOptions.columnSelection || advancedOptions.showAllColumns) {
      return dataState.columns;
    }
    
    return dataState.columns.filter(col => dataState.selectedColumns.includes(col.field));
  };

  // Handle column selection changes
  const handleColumnSelection = (columnField, checked) => {
    setDataState(prev => ({
      ...prev,
      selectedColumns: checked 
        ? [...prev.selectedColumns, columnField]
        : prev.selectedColumns.filter(field => field !== columnField)
    }));
  };

  // Select/deselect all columns
  const handleSelectAllColumns = (selectAll) => {
    setDataState(prev => ({
      ...prev,
      selectedColumns: selectAll ? prev.availableColumns.map(col => col.field) : []
    }));
  };
  };

  // Execute custom queries (predefined for demo)
  const executeCustomQuery = async (query) => {
    const queryLower = query.toLowerCase().trim();
    
    if (queryLower.includes('public designs') || queryLower.includes('public')) {
      const allDesigns = await designApi.getAllDesigns();
      return allDesigns.filter(design => design.isPublic);
    }
    
    if (queryLower.includes('recent') || queryLower.includes('today')) {
      const allDesigns = await designApi.getAllDesigns();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return allDesigns.filter(design => {
        const createdDate = Array.isArray(design.createdAt) 
          ? new Date(design.createdAt[0], design.createdAt[1] - 1, design.createdAt[2])
          : new Date(design.createdAt);
        return createdDate >= today;
      });
    }
    
    if (queryLower.includes('count') || queryLower.includes('summary')) {
      const allDesigns = await designApi.getAllDesigns();
      return [{
        metric: 'Total Designs',
        value: allDesigns.length,
        publicCount: allDesigns.filter(d => d.isPublic).length,
        privateCount: allDesigns.filter(d => !d.isPublic).length
      }];
    }
    
    // Default: return all designs
    return await designApi.getAllDesigns();
  };

  // Save table configuration
  const saveTableConfiguration = async () => {
    try {
      if (!designId || !component) {
        throw new Error('Design ID and component are required for saving');
      }

      const updatedComponent = {
        ...component,
        properties: {
          ...component.properties,
          dataConfig: dataState,
          advancedOptions: advancedOptions
        }
      };

      // Update the design with new component configuration
      const currentDesign = await designApi.getDesignById(designId);
      const updatedComponents = currentDesign.components.map(comp => 
        comp.id === component.id ? updatedComponent : comp
      );

      await designApi.updateDesign(designId, {
        ...currentDesign,
        components: updatedComponents
      });

      if (onSave) {
        onSave(updatedComponent);
      }

      setSaveDialog(false);
      
    } catch (error) {
      console.error('Save error:', error);
      setDataState(prev => ({
        ...prev,
        error: `Save failed: ${error.message}`
      }));
    }
  };

  // Reload table configuration
  const reloadTableConfiguration = async () => {
    try {
      if (!designId || !component) {
        throw new Error('Design ID and component are required for reloading');
      }

      const currentDesign = await designApi.getDesignById(designId);
      const reloadedComponent = currentDesign.components.find(comp => comp.id === component.id);

      if (reloadedComponent && reloadedComponent.properties.dataConfig) {
        setDataState(reloadedComponent.properties.dataConfig);
        if (reloadedComponent.properties.advancedOptions) {
          setAdvancedOptions(reloadedComponent.properties.advancedOptions);
        }
        
        if (onReload) {
          onReload(reloadedComponent);
        }
      }
      
    } catch (error) {
      console.error('Reload error:', error);
      setDataState(prev => ({
        ...prev,
        error: `Reload failed: ${error.message}`
      }));
    }
  };

  // Handle row updates (new editing API)
  const processRowUpdate = useCallback(async (newRow, oldRow) => {
    try {
      // Find the changed field
      const changedField = Object.keys(newRow).find(key => newRow[key] !== oldRow[key]);
      if (!changedField) return oldRow;

      // If we're editing designs or projects data, attempt to save to backend
      if (dataState.source === 'designs' || dataState.source === 'projects') {
        const endpoint = dataState.source === 'designs' ? '/api/designs' : '/api/projects';
        
        const response = await fetch(`${endpoint}/${newRow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'table-editor-user'
          },
          body: JSON.stringify(newRow)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${changedField}: ${response.statusText}`);
        }
        
        console.log(`Successfully updated ${changedField} for ${dataState.source} item ${newRow.id}`);
      }

      // Update local state
      setDataState(prev => ({
        ...prev,
        results: prev.results.map(row => 
          row.id === newRow.id ? newRow : row
        )
      }));

      return newRow;
    } catch (error) {
      console.error('Row update error:', error);
      setDataState(prev => ({
        ...prev,
        error: `Failed to update row: ${error.message}`
      }));
      // Return old row to revert the change
      return oldRow;
    }
  }, [dataState.source]);

  // Handle row update errors
  const handleProcessRowUpdateError = useCallback((error) => {
    console.error('Row update error:', error);
    setDataState(prev => ({
      ...prev,
      error: `Update failed: ${error.message}`
    }));
  }, []);

  // Handle cell edit commits (legacy API fallback)
  const handleCellEditCommit = useCallback(async (params) => {
    const { id, field, value } = params;
    
    try {
      // Update the local data immediately for responsive UI
      setDataState(prev => ({
        ...prev,
        results: prev.results.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        )
      }));

      // If we're editing designs or projects data, attempt to save to backend
      if (dataState.source === 'designs' || dataState.source === 'projects') {
        const endpoint = dataState.source === 'designs' ? '/api/designs' : '/api/projects';
        const rowData = dataState.results.find(row => row.id === id);
        
        if (rowData) {
          const updatedRow = { ...rowData, [field]: value };
          
          const response = await fetch(`${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': 'table-editor-user'
            },
            body: JSON.stringify(updatedRow)
          });
          
          if (!response.ok) {
            throw new Error(`Failed to update ${field}: ${response.statusText}`);
          }
          
          console.log(`Successfully updated ${field} for ${dataState.source} item ${id}`);
        }
      }
    } catch (error) {
      console.error('Cell edit error:', error);
      // Revert the change on error
      setDataState(prev => ({
        ...prev,
        results: prev.results.map(row => 
          row.id === id ? { ...row, [field]: params.value } : row
        ),
        error: `Failed to update ${field}: ${error.message}`
      }));
    }
  }, [dataState.source, dataState.results]);

  // Render data configuration tab
  const renderDataConfig = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Data Source</InputLabel>
            <Select
              value={dataState.source}
              label="Data Source"
              onChange={(e) => setDataState(prev => ({ ...prev, source: e.target.value }))}
            >
              {dataSources.map(source => (
                <MenuItem key={source.value} value={source.value}>
                  <Box>
                    <Typography variant="body2">{source.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {source.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={executeQuery}
              disabled={dataState.loading}
              size="small"
            >
              Execute Query
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => executeQuery()}
              disabled={dataState.loading}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Grid>

        {dataState.source === 'custom' && (
          <Grid item xs={12}>
            <TextField
              label="Custom Query"
              multiline
              rows={3}
              fullWidth
              value={dataState.query}
              onChange={(e) => setDataState(prev => ({ ...prev, query: e.target.value }))}
              placeholder="Enter query: 'public designs', 'recent designs', 'count summary'"
              size="small"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Rows: {dataState.totalRows} | 
              Last Fetched: {dataState.lastFetched ? new Date(dataState.lastFetched).toLocaleString() : 'Never'}
            </Typography>
            {dataState.loading && <CircularProgress size={16} />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Render data preview tab
  const renderDataPreview = () => (
    <Box sx={{ p: 2, height: 400 }}>
      {dataState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {dataState.error}
        </Alert>
      )}
      
      {dataState.results.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          💡 <strong>Editing Enabled:</strong> Double-click cells in Name, Description, Label, Placeholder, Title, and Text columns to edit values. Changes are automatically saved to the backend.
        </Alert>
      )}
      
      {dataState.results.length > 0 ? (
        <Box>
          {/* Column Selection Controls */}
          {advancedOptions.columnSelection && dataState.availableColumns.length > 0 && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ViewColumn fontSize="small" />
                  Column Selection ({dataState.selectedColumns.length} of {dataState.availableColumns.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<SelectAll />}
                    onClick={() => handleSelectAllColumns(true)}
                    disabled={dataState.selectedColumns.length === dataState.availableColumns.length}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    startIcon={<CheckBoxOutlineBlank />}
                    onClick={() => handleSelectAllColumns(false)}
                    disabled={dataState.selectedColumns.length === 0}
                  >
                    Clear All
                  </Button>
                  <Switch
                    checked={advancedOptions.showAllColumns}
                    onChange={(e) => setAdvancedOptions(prev => ({ 
                      ...prev, 
                      showAllColumns: e.target.checked 
                    }))}
                    size="small"
                  />
                  <Typography variant="caption">Show All</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dataState.availableColumns.map((column) => (
                  <FormControlLabel
                    key={column.field}
                    control={
                      <Checkbox
                        checked={dataState.selectedColumns.includes(column.field)}
                        onChange={(e) => handleColumnSelection(column.field, e.target.checked)}
                        size="small"
                      />
                    }
                    label={column.headerName}
                    sx={{ 
                      bgcolor: dataState.selectedColumns.includes(column.field) ? 'primary.light' : 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: dataState.selectedColumns.includes(column.field) ? 'primary.main' : 'grey.300',
                      m: 0,
                      '& .MuiTypography-root': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <DataGrid
            rows={dataState.results}
            columns={getDisplayColumns()}
            pageSize={dataState.pageSize}
            loading={dataState.loading}
          getRowId={(row, index) => {
            // First priority: standard id field
            if (row.id) return row.id;
            
            // Second priority: MongoDB _id field
            if (row._id) {
              // Handle MongoDB ObjectId (could be string or object)
              if (typeof row._id === 'string') return row._id;
              if (row._id.$oid) return row._id.$oid;
              if (row._id.timestamp) {
                // Combine timestamp with other unique identifiers to avoid duplicates
                const timestamp = row._id.timestamp.toString();
                const dateStr = row._id.date ? row._id.date.toString() : '';
                return `${timestamp}_${dateStr}_${index}`;
              }
              return JSON.stringify(row._id);
            }
            
            // Third priority: business key (like fund_code)
            if (row.fund_code) return `${row.fund_code}_${index}`;
            
            // Fourth priority: combination of available fields
            const keys = Object.keys(row);
            if (keys.length > 0) {
              const firstValue = row[keys[0]];
              return `${keys[0]}_${firstValue}_${index}`;
            }
            
            // Last resort: index-based ID
            return `row_${index}_${Date.now()}`;
          }}
          checkboxSelection={advancedOptions.rowSelection === 'multiple'}
          disableSelectionOnClick
          sortingOrder={['desc', 'asc']}
          pagination
          pageSizeOptions={[5, 10, 25, 50]}
          onPageSizeChange={(newPageSize) => 
            setDataState(prev => ({ ...prev, pageSize: newPageSize }))
          }
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onCellEditCommit={handleCellEditCommit}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          bgcolor: 'grey.50',
          borderRadius: 1
        }}>
          <TableChart sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure a data source and execute a query to see results
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Render advanced options tab
  const renderAdvancedOptions = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Row Selection</InputLabel>
            <Select
              value={advancedOptions.rowSelection}
              label="Row Selection"
              onChange={(e) => setAdvancedOptions(prev => ({ 
                ...prev, 
                rowSelection: e.target.value 
              }))}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="single">Single Row</MenuItem>
              <MenuItem value="multiple">Multiple Rows</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Refresh Interval (ms)"
            type="number"
            fullWidth
            size="small"
            value={advancedOptions.refreshInterval}
            onChange={(e) => setAdvancedOptions(prev => ({ 
              ...prev, 
              refreshInterval: parseInt(e.target.value) || 30000 
            }))}
            disabled={!advancedOptions.autoRefresh}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">Table Features</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label="Auto Refresh" 
                color={advancedOptions.autoRefresh ? 'primary' : 'default'}
                onClick={() => setAdvancedOptions(prev => ({ 
                  ...prev, 
                  autoRefresh: !prev.autoRefresh 
                }))}
                clickable
              />
              <Chip 
                label="Filtering" 
                color={advancedOptions.enableFiltering ? 'primary' : 'default'}
                onClick={() => setAdvancedOptions(prev => ({ 
                  ...prev, 
                  enableFiltering: !prev.enableFiltering 
                }))}
                clickable
              />
              <Chip 
                label="Sorting" 
                color={advancedOptions.enableSorting ? 'primary' : 'default'}
                onClick={() => setAdvancedOptions(prev => ({ 
                  ...prev, 
                  enableSorting: !prev.enableSorting 
                }))}
                clickable
              />
              <Chip 
                label="Pagination" 
                color={advancedOptions.enablePagination ? 'primary' : 'default'}
                onClick={() => setAdvancedOptions(prev => ({ 
                  ...prev, 
                  enablePagination: !prev.enablePagination 
                }))}
                clickable
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableChart color="primary" />
            Enhanced Table Component
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Save Configuration">
              <IconButton onClick={() => setSaveDialog(true)} size="small">
                <Save />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reload Configuration">
              <IconButton onClick={reloadTableConfiguration} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<Settings />} label="Data Config" />
          <Tab icon={<Visibility />} label="Preview" />
          <Tab icon={<Code />} label="Advanced" />
        </Tabs>

        {activeTab === 0 && renderDataConfig()}
        {activeTab === 1 && renderDataPreview()}
        {activeTab === 2 && renderAdvancedOptions()}
      </CardContent>

      {/* Save Configuration Dialog */}
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
        <DialogTitle>Save Table Configuration</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will save the current table configuration including data source, 
            query settings, and advanced options to the design.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
          <Button onClick={saveTableConfiguration} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EnhancedTableComponent;
