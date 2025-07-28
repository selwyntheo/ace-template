import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Switch,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Save,
  Settings,
  Visibility,
  Code,
  FilterList,
  ViewColumn,
  DataObject as DataObjectIcon,
  ExpandMore,
  Cancel,
  CheckCircle,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import designApi from '../services/designApi.js';

/**
 * TableConfigurationPanel - A dedicated configuration panel for Enhanced Table Components
 * This panel contains all the configuration options that were previously embedded in the table component
 */
const TableConfigurationPanel = ({ 
  component, 
  isEditMode = true,
  onPropertyChange,
  designId
}) => {
  // Create a ref to store the current component without causing re-renders
  const componentRef = useRef(component);
  componentRef.current = component;
  // ===== STATE MANAGEMENT =====
  const [dataState, setDataState] = useState({
    source: 'projects',
    query: '',
    results: [],
    columns: [],
    availableColumns: [],
    selectedColumns: [],
    lastFetched: null,
    totalRows: 0,
    page: 0,
    pageSize: 10,
    loading: false,
    error: null
  });

  const [advancedOptions, setAdvancedOptions] = useState({
    caching: false,
    autoRefresh: 30,
    errorHandling: 'strict',
    showExportOptions: true,
    enableFiltering: true,
    enableSorting: true,
    enablePagination: true,
    rowSelection: 'single',
    columnSelection: true,
    showAllColumns: true
  });

  const [columnConfigs, setColumnConfigs] = useState({});
  const [mongoQueryTemplate, setMongoQueryTemplate] = useState('');
  
  // Dialog states
  const [mongoQueryEditorDialog, setMongoQueryEditorDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [queryValidation, setQueryValidation] = useState({ isValid: true, error: null });
  const [activeTab, setActiveTab] = useState(0);

  // ===== DATA SOURCES CONFIGURATION =====
  const dataSources = [
    { 
      value: 'projects', 
      label: 'Projects Collection', 
      endpoint: '/projects',
      description: 'All project/design data from the database',
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
      description: 'Journal entry data',
      useGenericApi: true
    },
    { 
      value: 'custom', 
      label: 'Custom Query', 
      endpoint: '/custom',
      description: 'Execute custom database queries',
      useGenericApi: false
    },
    { 
      value: 'mongodb_query', 
      label: 'MongoDB Query', 
      endpoint: '/mongo/query',
      description: 'Execute native MongoDB queries',
      useGenericApi: true
    }
  ];

  // ===== MONGODB QUERY TEMPLATES =====
  const mongoQueryTemplates = {
    find: {
      name: 'Basic Find',
      description: 'Simple document search',
      template: `{
  "collection": "your_collection",
  "query": {
    "field": "value"
  },
  "options": {
    "limit": 100,
    "sort": { "_id": 1 }
  }
}`
    },
    aggregate: {
      name: 'Aggregation Pipeline',
      description: 'Complex data aggregation',
      template: `{
  "collection": "your_collection",
  "pipeline": [
    {
      "$match": {
        "status": "active"
      }
    },
    {
      "$group": {
        "_id": "$category",
        "count": { "$sum": 1 }
      }
    },
    {
      "$sort": { "count": -1 }
    }
  ]
}`
    },
    dateRange: {
      name: 'Date Range Query',
      description: 'Filter by date range',
      template: `{
  "collection": "your_collection",
  "query": {
    "createdAt": {
      "$gte": "2024-01-01",
      "$lte": "2024-12-31"
    }
  },
  "options": {
    "sort": { "createdAt": -1 }
  }
}`
    }
  };

  // ===== INITIALIZATION =====
  const componentId = component?.id;
  const componentProperties = component?.properties;
  
  useEffect(() => {
    console.log('🚀 TableConfigurationPanel: Component initialized', {
      componentId: componentId,
      designId: designId,
      hasComponent: !!component,
      hasProperties: !!componentProperties,
      properties: componentProperties
    });
    
    if (componentProperties?.dataConfig) {
      const savedConfig = componentProperties.dataConfig;
      console.log('TableConfigurationPanel: Loading saved configuration', savedConfig);
      
      setDataState(prev => ({
        ...prev,
        ...savedConfig
      }));
    }

    if (componentProperties?.advancedOptions) {
      setAdvancedOptions(prev => ({
        ...prev,
        ...componentProperties.advancedOptions
      }));
    }

    if (componentProperties?.columnConfigs) {
      setColumnConfigs(componentProperties.columnConfigs);
    }

    if (componentProperties?.mongoQueryTemplate) {
      setMongoQueryTemplate(componentProperties.mongoQueryTemplate);
    }
  }, [componentId, designId]); // Only depend on stable IDs

  // ===== SAVE CONFIGURATION =====
  const saveConfiguration = useCallback(async () => {
    try {
      const currentComponent = componentRef.current;
      if (!currentComponent) {
        throw new Error('Component is required for saving');
      }

      console.log('TableConfigurationPanel: Saving configuration', {
        componentId: currentComponent.id,
        designId: designId,
        dataConfig: dataState,
        advancedOptions: advancedOptions,
        columnConfigs: columnConfigs,
        mongoQueryTemplate: mongoQueryTemplate
      });

      // 1. Update properties via callback (updates in-memory store)
      if (onPropertyChange) {
        console.log('📤 TableConfigurationPanel: Updating properties via callback');
        onPropertyChange('dataConfig', dataState);
        onPropertyChange('advancedOptions', advancedOptions);
        onPropertyChange('columnConfigs', columnConfigs);
        onPropertyChange('mongoQueryTemplate', mongoQueryTemplate);
        console.log('✅ TableConfigurationPanel: Properties updated via callback');
      } else {
        console.warn('⚠️ TableConfigurationPanel: No onPropertyChange callback available');
      }

      // 2. Persist to MongoDB design collection
      if (designId && currentComponent?.id) {
        try {
          console.log('💾 TableConfigurationPanel: Saving to MongoDB design collection');
          
          // Get current design from MongoDB
          const currentDesign = await designApi.getDesignById(designId);
          console.log('📖 Current design loaded:', currentDesign.name);
          
          // Update the specific component's properties
          const updatedComponents = currentDesign.components.map(comp => 
            comp.id === currentComponent.id ? { 
              ...comp, 
              properties: {
                ...comp.properties,
                dataConfig: dataState,
                advancedOptions: advancedOptions,
                columnConfigs: columnConfigs,
                mongoQueryTemplate: mongoQueryTemplate
              }
            } : comp
          );

          // Save the updated design back to MongoDB
          const updatedDesign = {
            ...currentDesign,
            components: updatedComponents,
            lastModified: new Date().toISOString()
          };
          
          await designApi.updateDesign(designId, updatedDesign);
          
          // Update last fetched time to indicate successful save
          setDataState(prev => ({ ...prev, lastFetched: new Date().toISOString() }));
          
          console.log('✅ TableConfigurationPanel: Configuration saved to MongoDB designs collection');
        } catch (error) {
          console.error('❌ TableConfigurationPanel: Failed to save to MongoDB:', error);
          throw error; // Re-throw to show user
        }
      } else {
        console.warn('⚠️ TableConfigurationPanel: Missing designId or currentComponent.id, skipping MongoDB save');
      }

      return true;
    } catch (error) {
      console.error('❌ TableConfigurationPanel: Save error:', error);
      return false;
    }
  }, [dataState, advancedOptions, columnConfigs, mongoQueryTemplate, onPropertyChange, designId]); // Removed componentId dependency

  // ===== DATA FETCHING =====
  const executeQuery = async () => {
    setDataState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let results = [];
      
      if (dataState.source === 'mongodb_query' && mongoQueryTemplate) {
        results = await executeMongoQuery(mongoQueryTemplate);
      } else {
        results = await fetchCollectionData(dataState.source);
      }

      // Generate columns from data
      const columns = results.length > 0 ? generateColumns(results[0]) : [];
      
      setDataState(prev => ({
        ...prev,
        results: results,
        columns: columns,
        availableColumns: columns,
        selectedColumns: columns.map(col => col.field),
        totalRows: results.length,
        lastFetched: new Date().toISOString(),
        loading: false
      }));

      // Auto-save after successful query
      await saveConfiguration();
      
      console.log('✅ TableConfigurationPanel: Query executed and configuration saved');
      
    } catch (error) {
      console.error('Query execution error:', error);
      setDataState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const fetchCollectionData = async (collectionName) => {
    const dataSource = dataSources.find(ds => ds.value === collectionName);
    if (!dataSource) {
      throw new Error(`Unknown collection: ${collectionName}`);
    }

    const response = await fetch(`http://localhost:8080/api${dataSource.endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'table-config-panel'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  };

  const executeMongoQuery = async (query) => {
    try {
      let parsedQuery;
      try {
        parsedQuery = JSON.parse(query);
      } catch (e) {
        throw new Error('Invalid JSON format. Please provide a valid MongoDB query.');
      }

      // Handle different query types
      if (parsedQuery.pipeline) {
        // Aggregation query
        const response = await fetch('http://localhost:8080/api/mongo/aggregate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'table-config-panel'
          },
          body: JSON.stringify({
            collection: parsedQuery.collection,
            pipeline: parsedQuery.pipeline
          })
        });

        if (!response.ok) {
          throw new Error(`MongoDB aggregation failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data || [];
      } else {
        // Regular find query
        const response = await fetch('http://localhost:8080/api/mongo/find', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'table-config-panel'
          },
          body: JSON.stringify(parsedQuery)
        });

        if (!response.ok) {
          throw new Error(`MongoDB query failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data || [];
      }
    } catch (error) {
      console.error('MongoDB query execution error:', error);
      throw error;
    }
  };

  const generateColumns = (sampleRow) => {
    return Object.keys(sampleRow).map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      width: 150,
      type: typeof sampleRow[key] === 'number' ? 'number' : 
            key.includes('date') || key.includes('time') ? 'date' : 'string'
    }));
  };

  // ===== QUERY VALIDATION =====
  const validateMongoQuery = (query) => {
    try {
      if (!query.trim()) {
        return { isValid: false, error: 'Query cannot be empty' };
      }

      const parsed = JSON.parse(query);
      
      if (!parsed.collection && !parsed.pipeline) {
        return { isValid: false, error: 'Query must include a collection name or pipeline' };
      }

      return { isValid: true, error: null };
    } catch (e) {
      return { isValid: false, error: `Invalid JSON: ${e.message}` };
    }
  };

  // ===== EVENT HANDLERS =====
  const handleSourceChange = (event) => {
    const newSource = event.target.value;
    setDataState(prev => ({
      ...prev,
      source: newSource,
      query: '',
      results: [],
      columns: [],
      error: null
    }));
  };

  const handleMongoQueryChange = (value) => {
    setMongoQueryTemplate(value);
    const validation = validateMongoQuery(value);
    setQueryValidation(validation);
  };

  const handleApplyMongoQuery = () => {
    const validation = validateMongoQuery(mongoQueryTemplate);
    setQueryValidation(validation);
    
    if (validation.isValid) {
      setDataState(prev => ({
        ...prev,
        query: mongoQueryTemplate,
        source: 'mongodb_query'
      }));
      setMongoQueryEditorDialog(false);
    }
  };

  const handleSaveAndClose = async () => {
    const success = await saveConfiguration();
    if (success) {
      setSaveDialog(false);
    }
  };

  // ===== RENDER METHODS =====
  const renderDataSourceConfiguration = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data Source Configuration
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Data Source</InputLabel>
          <Select
            value={dataState.source}
            label="Data Source"
            onChange={handleSourceChange}
          >
            {dataSources.map((source) => (
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

        {dataState.source === 'mongodb_query' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Code />}
              onClick={() => setMongoQueryEditorDialog(true)}
              fullWidth
            >
              Configure MongoDB Query
            </Button>
            {mongoQueryTemplate && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Query Preview:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                  {mongoQueryTemplate.substring(0, 200)}
                  {mongoQueryTemplate.length > 200 ? '...' : ''}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={executeQuery}
            disabled={dataState.loading}
          >
            {dataState.loading ? 'Loading...' : 'Execute Query'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => executeQuery()}
            disabled={dataState.loading}
          >
            Refresh
          </Button>
        </Stack>

        {dataState.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {dataState.error}
          </Alert>
        )}

        {dataState.results.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loaded {dataState.results.length} rows • Last updated: {
                dataState.lastFetched ? new Date(dataState.lastFetched).toLocaleString() : 'Never'
              }
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderAdvancedOptions = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Advanced Options
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedOptions.caching}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    caching: e.target.checked
                  }))}
                />
              }
              label="Enable Caching"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedOptions.enableFiltering}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    enableFiltering: e.target.checked
                  }))}
                />
              }
              label="Enable Filtering"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedOptions.enableSorting}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    enableSorting: e.target.checked
                  }))}
                />
              }
              label="Enable Sorting"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={advancedOptions.enablePagination}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    enablePagination: e.target.checked
                  }))}
                />
              }
              label="Enable Pagination"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Auto Refresh (seconds)"
              type="number"
              value={advancedOptions.autoRefresh}
              onChange={(e) => setAdvancedOptions(prev => ({
                ...prev,
                autoRefresh: parseInt(e.target.value) || 30
              }))}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Error Handling</InputLabel>
              <Select
                value={advancedOptions.errorHandling}
                label="Error Handling"
                onChange={(e) => setAdvancedOptions(prev => ({
                  ...prev,
                  errorHandling: e.target.value
                }))}
              >
                <MenuItem value="strict">Strict</MenuItem>
                <MenuItem value="graceful">Graceful</MenuItem>
                <MenuItem value="ignore">Ignore</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderColumnConfiguration = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Column Configuration
        </Typography>
        
        {dataState.columns.length > 0 ? (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available Columns ({dataState.columns.length})
            </Typography>
            
            <Grid container spacing={1}>
              {dataState.columns.map((column) => (
                <Grid item key={column.field}>
                  <Chip
                    label={column.headerName}
                    variant={dataState.selectedColumns.includes(column.field) ? "filled" : "outlined"}
                    onClick={() => {
                      const isSelected = dataState.selectedColumns.includes(column.field);
                      setDataState(prev => ({
                        ...prev,
                        selectedColumns: isSelected 
                          ? prev.selectedColumns.filter(f => f !== column.field)
                          : [...prev.selectedColumns, column.field]
                      }));
                    }}
                    color="primary"
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Execute a query to see available columns
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const renderSaveActions = () => (
    <Card variant="outlined">
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {dataState.lastFetched ? 
              `Last saved: ${new Date(dataState.lastFetched).toLocaleString()}` : 
              'Configuration not saved'
            }
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Component ID: {component?.id || 'None'} | Design ID: {designId || 'None'}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => {
              console.log('🔍 Current Configuration State:', {
                dataState,
                advancedOptions,
                columnConfigs,
                mongoQueryTemplate,
                component,
                designId
              });
            }}
          >
            Debug Config
          </Button>
          
          <Button
            variant="outlined"
            onClick={async () => {
              const currentComponent = componentRef.current;
              if (designId && currentComponent?.id) {
                try {
                  const design = await designApi.getDesignById(designId);
                  const tableComponent = design.components.find(c => c.id === currentComponent.id);
                  console.log('🔍 Table component from MongoDB:', tableComponent);
                  alert(`Table config loaded from DB:\nData Config: ${!!tableComponent?.properties?.dataConfig}\nAdvanced Options: ${!!tableComponent?.properties?.advancedOptions}\nColumn Configs: ${!!tableComponent?.properties?.columnConfigs}`);
                } catch (error) {
                  console.error('Failed to load from DB:', error);
                  alert('Failed to load from DB: ' + error.message);
                }
              }
            }}
          >
            Test Load from DB
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => setSaveDialog(true)}
          >
            Save Configuration
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveConfiguration}
            color="success"
          >
            Save & Apply
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );

  // ===== DIALOGS =====
  const renderMongoQueryEditor = () => (
    <Dialog
      open={mongoQueryEditorDialog}
      onClose={() => setMongoQueryEditorDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        MongoDB Query Editor
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Template Examples:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(mongoQueryTemplates).map(([key, template]) => (
              <Chip
                key={key}
                label={template.name}
                onClick={() => setMongoQueryTemplate(template.template)}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={12}
          label="MongoDB Query"
          value={mongoQueryTemplate}
          onChange={(e) => handleMongoQueryChange(e.target.value)}
          variant="outlined"
          placeholder="Enter your MongoDB query in JSON format..."
          sx={{ mb: 2 }}
        />

        {!queryValidation.isValid && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {queryValidation.error}
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setMongoQueryEditorDialog(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleApplyMongoQuery}
          variant="contained"
          disabled={!queryValidation.isValid}
        >
          Apply Query
        </Button>
      </DialogActions>
    </Dialog>
  );

  // ===== MAIN RENDER =====
  if (!isEditMode) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">
          Configuration panel is only available in edit mode
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxHeight: '100vh', overflow: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Table Configuration
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Configure data source, advanced options, and column settings for your table component.
      </Typography>

      {renderDataSourceConfiguration()}
      {renderAdvancedOptions()}
      {renderColumnConfiguration()}
      {renderSaveActions()}

      {/* Dialogs */}
      {renderMongoQueryEditor()}

      {/* Save Confirmation Dialog */}
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
        <DialogTitle>Save Configuration</DialogTitle>
        <DialogContent>
          <Typography>
            Save the current table configuration? This will update the component properties and persist the changes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAndClose} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableConfigurationPanel;
