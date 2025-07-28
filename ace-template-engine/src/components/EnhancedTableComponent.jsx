import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Save,
  Settings,
  TableChart,
  Visibility,
  Code,
  ViewColumn,
  SelectAll,
  CheckBoxOutlineBlank
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
  // Core state
  const [activeTab, setActiveTab] = useState(0);
  const [saveDialog, setSaveDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Data state
  const [dataState, setDataState] = useState({
    source: 'fund_info',
    query: '',
    results: [],
    columns: [],
    availableColumns: [],
    selectedColumns: [],
    loading: false,
    error: null,
    lastFetched: null,
    pageSize: 10
  });

  // Data sources configuration
  const dataSources = [
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
      value: 'custom_query', 
      label: 'Custom Query', 
      endpoint: '/custom',
      description: 'Execute custom database queries',
      useGenericApi: false
    }
  ];

  // Custom Query Management States
  const [savedQueries, setSavedQueries] = useState([]);
  const [queryName, setQueryName] = useState('');
  const [saveQueryDialog, setSaveQueryDialog] = useState(false);
  const [loadQueryDialog, setLoadQueryDialog] = useState(false);
  const [customQueryDialog, setCustomQueryDialog] = useState(false);

  // Column Configuration States
  const [columnConfigs, setColumnConfigs] = useState({});
  const [selectedColumnForConfig, setSelectedColumnForConfig] = useState(null);
  const [columnConfigDialog, setColumnConfigDialog] = useState(false);

  // Load saved queries on mount
  useEffect(() => {
    if (designId) {
      loadSavedQueries();
    }
  }, [designId]);

  // Initialize component from existing properties (load from PropertyInspector or design collection)
  useEffect(() => {
    if (!isInitialized && (component?.properties || designId)) {
      const initializeComponent = async () => {
        // First, try to load from design collection (more comprehensive)
        if (designId && component?.id) {
          await loadCompleteConfiguration();
        }
        
        // If no design collection data, fall back to PropertyInspector properties
        if (component?.properties && (!designId || !component?.id)) {
          const props = component.properties;
          
          // Load data configuration
          if (props.tableConfig) {
            setDataState(prev => ({
              ...prev,
              source: props.tableConfig.source || 'fund_info',
              query: props.tableConfig.query || '',
              pageSize: props.tableConfig.pageSize || 10
            }));
          }
          
          // Load column configurations
          if (props.columnConfigs) {
            setColumnConfigs(props.columnConfigs);
          }
          
          // Load selected columns
          if (props.selectedColumns) {
            setDataState(prev => ({
              ...prev,
              selectedColumns: props.selectedColumns
            }));
          }
          
          // Auto-execute query if we have a valid source
          const source = props.tableConfig?.source || 'fund_info';
          if (source !== 'custom_query') {
            setTimeout(() => {
              executeQueryWithSource(source, props.tableConfig?.query || '');
            }, 100);
          }
        }
        
        setIsInitialized(true);
      };
      
      initializeComponent();
    }
  }, [component?.properties, component?.id, designId, isInitialized]);

  // Auto-load default collection on mount (only if not initialized from properties)
  useEffect(() => {
    if (isInitialized && dataState.source !== 'custom_query' && dataState.results.length === 0) {
      executeQuery();
    }
  }, [dataState.source, isInitialized]); // Run when source changes and component is initialized

  const loadSavedQueries = async () => {
    try {
      if (!designId) {
        console.warn('No designId provided, skipping loading saved queries');
        return;
      }
      
      const designData = await designApi.getDesignById(designId);
      if (designData?.customQueries) {
        setSavedQueries(designData.customQueries);
        console.log(`Loaded ${designData.customQueries.length} saved queries`);
      }
    } catch (error) {
      console.error('Failed to load saved queries:', error);
      // Don't show error to user for this background operation
    }
  };

  // Save custom query to design collection
  const saveCustomQuery = async () => {
    if (!queryName.trim()) return;
    
    // For custom queries, require query content
    if (dataState.source === 'custom_query' && !dataState.query.trim()) return;

    try {
      const newQuery = {
        id: Date.now().toString(),
        name: queryName.trim(),
        query: dataState.source === 'custom_query' ? dataState.query : `Collection: ${dataState.source}`,
        queryType: dataState.source,
        createdAt: new Date().toISOString(),
        lastUsed: null
      };

      const updatedQueries = [...savedQueries, newQuery];
      setSavedQueries(updatedQueries);

      // Save to design collection
      await saveCompleteConfiguration(updatedQueries);

      setSaveQueryDialog(false);
      setQueryName('');
      
      console.log('Query configuration saved successfully');
    } catch (error) {
      console.error('Failed to save query configuration:', error);
    }
  };

  // Save complete configuration (table + PropertyInspector) to design collection
  const saveCompleteConfiguration = async (customQueries = savedQueries) => {
    if (!designId) {
      console.warn('No designId provided, cannot save configuration');
      return;
    }

    try {
      const designData = await designApi.getDesignById(designId);
      
      // Merge table configuration with existing design data
      const updatedDesignData = {
        ...designData,
        customQueries: customQueries,
        // Store table-specific configuration separately for easy access
        tableConfigurations: {
          ...designData.tableConfigurations,
          [component?.id || 'default']: {
            dataSource: dataState.source,
            query: dataState.query,
            pageSize: dataState.pageSize,
            columnConfigs: columnConfigs,
            selectedColumns: dataState.selectedColumns,
            availableColumns: dataState.availableColumns.map(col => ({
              field: col.field,
              headerName: col.headerName,
              type: col.type,
              width: col.width
            })),
            lastFetched: dataState.lastFetched,
            updatedAt: new Date().toISOString()
          }
        }
      };

      await designApi.updateDesign(designId, updatedDesignData);
      
      // Also sync with PropertyInspector
      syncConfigWithPropertyInspector();
      
      console.log('Complete configuration saved successfully');
    } catch (error) {
      console.error('Failed to save complete configuration:', error);
      throw error;
    }
  };

  // Load saved query
  const loadSavedQuery = async (savedQuery) => {
    try {
      setDataState(prev => ({
        ...prev,
        source: savedQuery.queryType,
        query: savedQuery.queryType === 'custom_query' ? savedQuery.query : ''
      }));

      // Update last used timestamp
      const updatedQueries = savedQueries.map(q => 
        q.id === savedQuery.id 
          ? { ...q, lastUsed: new Date().toISOString() }
          : q
      );
      setSavedQueries(updatedQueries);

      // Save complete configuration
      await saveCompleteConfiguration(updatedQueries);

      setLoadQueryDialog(false);
      
      // Auto-execute if it's a collection query
      if (savedQuery.queryType !== 'custom_query') {
        setTimeout(() => executeQuery(), 100);
      }
      
      console.log('Query configuration loaded successfully');
    } catch (error) {
      console.error('Failed to load query configuration:', error);
    }
  };

  // Delete saved query
  const deleteSavedQuery = async (queryId) => {
    try {
      const updatedQueries = savedQueries.filter(q => q.id !== queryId);
      setSavedQueries(updatedQueries);

      // Save complete configuration
      await saveCompleteConfiguration(updatedQueries);

      console.log('Custom query deleted successfully');
    } catch (error) {
      console.error('Failed to delete custom query:', error);
    }
  };

  // Load complete configuration from design collection
  const loadCompleteConfiguration = async () => {
    if (!designId || !component?.id) {
      return;
    }

    try {
      const designData = await designApi.getDesignById(designId);
      const tableConfig = designData.tableConfigurations?.[component.id];
      
      if (tableConfig) {
        // Load data state
        setDataState(prev => ({
          ...prev,
          source: tableConfig.dataSource || 'fund_info',
          query: tableConfig.query || '',
          pageSize: tableConfig.pageSize || 10,
          selectedColumns: tableConfig.selectedColumns || [],
          availableColumns: tableConfig.availableColumns || []
        }));
        
        // Load column configurations
        if (tableConfig.columnConfigs) {
          setColumnConfigs(tableConfig.columnConfigs);
        }
        
        console.log('Complete configuration loaded from design collection');
        
        // Auto-execute query if we have a valid source
        if (tableConfig.dataSource !== 'custom_query') {
          setTimeout(() => {
            executeQueryWithSource(tableConfig.dataSource, tableConfig.query);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Failed to load complete configuration:', error);
    }
  };

  // Export queries as JSON
  const exportQueries = () => {
    const dataStr = JSON.stringify(savedQueries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-queries-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Sync table configuration with PropertyInspector
  const syncConfigWithPropertyInspector = useCallback(() => {
    if (onPropertyChange && isInitialized) {
      const tableConfiguration = {
        tableConfig: {
          source: dataState.source,
          query: dataState.query,
          pageSize: dataState.pageSize,
          lastFetched: dataState.lastFetched
        },
        columnConfigs: columnConfigs,
        selectedColumns: dataState.selectedColumns,
        availableColumns: dataState.availableColumns.map(col => ({
          field: col.field,
          headerName: col.headerName,
          type: col.type,
          width: col.width
        }))
      };
      
      onPropertyChange('tableConfiguration', tableConfiguration);
      console.log('Synced table configuration with PropertyInspector');
    }
  }, [dataState.source, dataState.query, dataState.pageSize, dataState.selectedColumns, 
      dataState.availableColumns, columnConfigs, onPropertyChange, isInitialized]);

  // Sync configuration when relevant state changes (debounced to avoid loops)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncConfigWithPropertyInspector();
    }, 500); // Debounce to avoid too frequent updates

    return () => clearTimeout(timeoutId);
  }, [syncConfigWithPropertyInspector]);

  // Execute query with specific source and query (for initialization)
  const executeQueryWithSource = async (source, query = '') => {
    setDataState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let results = [];
      
      if (source === 'custom_query' && query.trim()) {
        results = await executeCustomQuery(query);
      } else if (source !== 'custom_query') {
        results = await fetchCollectionData(source);
      }

      const columns = results.length > 0 ? generateColumns(results[0]) : [];
      
      setDataState(prev => ({
        ...prev,
        source: source,
        query: query,
        results: results,
        columns: columns,
        availableColumns: columns,
        selectedColumns: prev.selectedColumns.length > 0 ? prev.selectedColumns : columns.map(col => col.field),
        loading: false,
        lastFetched: new Date().toISOString()
      }));
    } catch (error) {
      setDataState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Execute query - handles both collection fetching and custom queries
  const executeQuery = async () => {
    return executeQueryWithSource(dataState.source, dataState.query);
  };

  // Fetch data from predefined collections
  const fetchCollectionData = async (collectionName) => {
    const dataSource = dataSources.find(ds => ds.value === collectionName);
    if (!dataSource) {
      throw new Error(`Unknown collection: ${collectionName}`);
    }

    const response = await fetch(`http://localhost:8080/api${dataSource.endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'enhanced-table-component'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  };

  // Execute custom query (MongoDB aggregation or find)
  const executeCustomQuery = async (query) => {
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
            'x-user-id': 'enhanced-table-component'
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
            'x-user-id': 'enhanced-table-component'
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
      console.error('Custom query execution error:', error);
      throw error;
    }
  };

  // Generate columns from sample data
  const generateColumns = (sampleRow) => {
    return Object.keys(sampleRow).map((key, index) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      width: 150,
      type: typeof sampleRow[key] === 'number' ? 'number' : 
            key.includes('date') || key.includes('time') ? 'date' : 'string',
      // Ensure unique field names
      uniqueKey: `${key}-${index}`
    }));
  };

  // Column configuration functions
  const handleColumnSelection = (field, isVisible) => {
    setDataState(prev => ({
      ...prev,
      selectedColumns: isVisible 
        ? [...prev.selectedColumns, field]
        : prev.selectedColumns.filter(col => col !== field)
    }));
  };

  const handleSelectAllColumns = (selectAll) => {
    setDataState(prev => ({
      ...prev,
      selectedColumns: selectAll ? prev.availableColumns.map(col => col.field) : []
    }));
  };

  const updateColumnConfig = (field, config) => {
    setColumnConfigs(prev => ({
      ...prev,
      [field]: { ...prev[field], ...config }
    }));
  };

  const openColumnConfig = (column) => {
    setSelectedColumnForConfig(column);
    setColumnConfigDialog(true);
  };

  // Get display columns with configurations applied
  const getDisplayColumns = () => {
    return dataState.availableColumns
      .filter(col => dataState.selectedColumns.includes(col.field))
      .map(col => {
        const config = columnConfigs[col.field] || {};
        return {
          ...col,
          headerName: config.displayName || col.headerName,
          width: config.width || col.width || 150,
          type: config.dataType || col.type,
          sortable: config.sortable !== undefined ? config.sortable : true,
          editable: config.editable || false,
          hide: config.hidden || false,
          align: config.alignment || 'left',
          headerAlign: config.headerAlignment || 'left',
          valueFormatter: config.formatter ? getValueFormatter(config.formatter) : undefined
        };
      });
  };

  const getValueFormatter = (formatter) => {
    switch (formatter) {
      case 'currency':
        return (params) => new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(params.value);
      case 'percentage':
        return (params) => `${(params.value * 100).toFixed(2)}%`;
      case 'date':
        return (params) => new Date(params.value).toLocaleDateString();
      case 'datetime':
        return (params) => new Date(params.value).toLocaleString();
      default:
        return undefined;
    }
  };

  // Manual save function that can be called externally
  const saveConfiguration = useCallback(async () => {
    try {
      await saveCompleteConfiguration();
      console.log('Configuration saved manually');
      return true;
    } catch (error) {
      console.error('Failed to save configuration manually:', error);
      return false;
    }
  }, [saveCompleteConfiguration]);

  // Expose saveConfiguration to parent components via onSave callback
  useEffect(() => {
    if (onSave && typeof onSave === 'function') {
      onSave(saveConfiguration);
    }
  }, [onSave, saveConfiguration]);

  // Render data configuration tab
  const renderDataConfig = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Data Source Configuration
      </Typography>
      
      <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
        <InputLabel>Data Source</InputLabel>
        <Select
          value={dataState.source}
          label="Data Source"
          onChange={(e) => {
            const newSource = e.target.value;
            setDataState(prev => ({
              ...prev,
              source: newSource,
              query: newSource === 'custom_query' ? prev.query : '',
              results: [],
              columns: [],
              error: null
            }));
          }}
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

      {dataState.source === 'custom_query' && (
        <TextField
          label="Custom MongoDB Query"
          multiline
          rows={8}
          fullWidth
          value={dataState.query}
          onChange={(e) => setDataState(prev => ({ ...prev, query: e.target.value }))}
          placeholder={`Enter your custom MongoDB query in JSON format...

Examples:
• Simple find: {"collection": "fund_info", "query": {"status": "active"}}
• Aggregation: {"collection": "account_balances", "pipeline": [{"$match": {"balance": {"$gte": 1000}}}, {"$sort": {"balance": -1}}]}`}
          sx={{
            mb: 2,
            '& .MuiInputBase-input': {
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.875rem'
            }
          }}
        />
      )}

      {dataState.source !== 'custom_query' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Selected collection: <strong>{dataSources.find(ds => ds.value === dataState.source)?.label}</strong>
            <br />
            This will fetch all records from the {dataState.source} collection.
          </Typography>
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={executeQuery}
          disabled={dataState.loading || (dataState.source === 'custom_query' && !dataState.query.trim())}
        >
          {dataState.loading ? 'Loading...' : dataState.source === 'custom_query' ? 'Execute Custom Query' : 'Load Collection Data'}
        </Button>
        
        {dataState.source === 'custom_query' && (
          <>
            <Button
              variant="outlined"
              onClick={() => setSaveQueryDialog(true)}
              disabled={!dataState.query.trim()}
            >
              Save Query
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setLoadQueryDialog(true)}
              disabled={savedQueries.length === 0}
            >
              Load Query
            </Button>
            
            <Button
              variant="outlined"
              onClick={exportQueries}
              disabled={savedQueries.length === 0}
            >
              Export Queries
            </Button>
          </>
        )}
        
        {dataState.source !== 'custom_query' && (
          <>
            <Button
              variant="outlined"
              onClick={() => setSaveQueryDialog(true)}
            >
              Save Configuration
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setLoadQueryDialog(true)}
              disabled={savedQueries.length === 0}
            >
              Load Configuration
            </Button>
          </>
        )}
      </Stack>

      {dataState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {dataState.error}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        {dataState.source === 'custom_query' ? 
          `${savedQueries.length} saved custom queries available` :
          `Loading data from ${dataState.source} collection`
        }
      </Typography>
    </Box>
  );

  // Render column configuration tab
  const renderColumnConfig = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewColumn />
          Column Configuration
        </Typography>
        
        {dataState.availableColumns.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<SelectAll />}
              onClick={() => handleSelectAllColumns(true)}
              disabled={dataState.selectedColumns.length === dataState.availableColumns.length}
            >
              Show All
            </Button>
            <Button
              size="small"
              startIcon={<CheckBoxOutlineBlank />}
              onClick={() => handleSelectAllColumns(false)}
              disabled={dataState.selectedColumns.length === 0}
            >
              Hide All
            </Button>
          </Box>
        )}
      </Box>
      
      {dataState.availableColumns.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(43, 156, 174, 0.08)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>
                    Visible
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>
                    Column
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>
                    Display Name
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>
                    Width
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataState.availableColumns.map((column, index) => {
                  const isVisible = dataState.selectedColumns.includes(column.field);
                  const config = columnConfigs[column.field] || {};
                  
                  return (
                    <tr 
                      key={`column-config-${index}-${column.field}`}
                      style={{ 
                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(250, 250, 250, 0.5)'
                      }}
                    >
                      <td style={{ padding: '8px' }}>
                        <Checkbox
                          checked={isVisible}
                          onChange={(e) => handleColumnSelection(column.field, e.target.checked)}
                          size="small"
                        />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {column.field}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {column.type || 'string'}
                        </Typography>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <TextField
                          size="small"
                          variant="outlined"
                          value={config.displayName || column.headerName || column.field}
                          onChange={(e) => updateColumnConfig(column.field, { displayName: e.target.value })}
                          sx={{ minWidth: 120 }}
                        />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <TextField
                          size="small"
                          type="number"
                          variant="outlined"
                          value={config.width || column.width || 150}
                          onChange={(e) => updateColumnConfig(column.field, { width: parseInt(e.target.value) })}
                          sx={{ width: 80 }}
                        />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Configure Column">
                            <IconButton 
                              size="small"
                              onClick={() => openColumnConfig(column)}
                            >
                              <Settings fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {Object.keys(config).length > 0 && (
                            <Tooltip title="Reset Configuration">
                              <IconButton 
                                size="small"
                                color="warning"
                                onClick={() => {
                                  setColumnConfigs(prev => {
                                    const newConfigs = { ...prev };
                                    delete newConfigs[column.field];
                                    return newConfigs;
                                  });
                                }}
                              >
                                <Refresh fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
          
          <Box sx={{ p: 2, bgcolor: 'rgba(43, 156, 174, 0.03)', borderTop: '1px solid rgba(224, 224, 224, 0.5)' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{dataState.selectedColumns.length}</strong> of <strong>{dataState.availableColumns.length}</strong> columns visible
              {dataState.selectedColumns.length === 0 && ' • No columns selected - table will be empty'}
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 200,
          bgcolor: 'rgba(43, 156, 174, 0.03)',
          borderRadius: 1,
          border: '1px solid rgba(43, 156, 174, 0.1)'
        }}>
          <ViewColumn sx={{ fontSize: 48, color: 'rgba(43, 156, 174, 0.4)', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Columns Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Execute a query in 'Table Setup' to see column configuration options
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Render advanced column configuration dialog
  const renderColumnConfigDialog = () => (
    <Dialog 
      open={columnConfigDialog} 
      onClose={() => setColumnConfigDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Advanced Column Configuration: {selectedColumnForConfig?.field}
      </DialogTitle>
      <DialogContent>
        {selectedColumnForConfig && (
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  variant="outlined"
                  value={columnConfigs[selectedColumnForConfig.field]?.displayName || selectedColumnForConfig.headerName || selectedColumnForConfig.field}
                  onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { displayName: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Width"
                  type="number"
                  variant="outlined"
                  value={columnConfigs[selectedColumnForConfig.field]?.width || selectedColumnForConfig.width || 150}
                  onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { width: parseInt(e.target.value) })}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Data Type</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig.field]?.type || selectedColumnForConfig.type || 'string'}
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { type: e.target.value })}
                    label="Data Type"
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="datetime">Date & Time</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig.field]?.format || 'none'}
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { format: e.target.value })}
                    label="Format"
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="currency">Currency ($)</MenuItem>
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="date">Date (MM/DD/YYYY)</MenuItem>
                    <MenuItem value="datetime">Date & Time</MenuItem>
                    <MenuItem value="number">Number (with commas)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Alignment</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig.field]?.align || 'left'}
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { align: e.target.value })}
                    label="Alignment"
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig.field]?.sortable !== false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { sortable: e.target.checked })}
                      />
                    }
                    label="Sortable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig.field]?.filterable !== false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { filterable: e.target.checked })}
                      />
                    }
                    label="Filterable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig.field]?.hideable !== false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { hideable: e.target.checked })}
                      />
                    }
                    label="Hideable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig.field]?.resizable !== false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { resizable: e.target.checked })}
                      />
                    }
                    label="Resizable"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  variant="outlined"
                  value={columnConfigs[selectedColumnForConfig.field]?.description || ''}
                  onChange={(e) => updateColumnConfig(selectedColumnForConfig.field, { description: e.target.value })}
                  placeholder="Optional description for this column..."
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setColumnConfigDialog(false)}>
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setColumnConfigDialog(false)}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render data preview tab
  const renderDataPreview = () => (
    <Box sx={{ p: 2 }}>
      {dataState.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading data...</Typography>
        </Box>
      )}
      
      {!dataState.loading && dataState.results.length > 0 && (
        <Box>
          <DataGrid
            rows={dataState.results}
            columns={getDisplayColumns()}
            pageSize={dataState.pageSize}
            loading={dataState.loading}
            getRowId={(row, index) => {
              // Create a more unique row ID to avoid duplicates
              // Check for valid string/number IDs first
              if (row.id && (typeof row.id === 'string' || typeof row.id === 'number')) {
                return `row-${row.id}`;
              }
              if (row._id && (typeof row._id === 'string' || typeof row._id === 'number')) {
                return `row-${row._id}`;
              }
              if (row.uuid && typeof row.uuid === 'string') {
                return `row-${row.uuid}`;
              }
              
              // For object IDs, try to extract meaningful string representation
              if (row._id && typeof row._id === 'object') {
                // Handle MongoDB ObjectId
                if (row._id.$oid) return `row-${row._id.$oid}`;
                if (row._id.toString && typeof row._id.toString === 'function') {
                  const idStr = row._id.toString();
                  if (idStr !== '[object Object]') return `row-${idStr}`;
                }
              }
              
              // Create a hash from row content for consistent IDs
              const rowString = JSON.stringify(row);
              const hash = rowString.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a; // Convert to 32-bit integer
              }, 0);
              
              // Fallback to index with hash for uniqueness
              return `row-${index}-${Math.abs(hash)}`;
            }}
            pagination
            pageSizeOptions={[5, 10, 25, 50]}
            onPageSizeChange={(newPageSize) => 
              setDataState(prev => ({ ...prev, pageSize: newPageSize }))
            }
            sx={{
              height: 400,
              '& .MuiDataGrid-root': {
                border: 'none'
              }
            }}
          />
        </Box>
      )}
      
      {!dataState.loading && dataState.results.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 300,
          bgcolor: 'rgba(43, 156, 174, 0.03)',
          borderRadius: 1,
          border: '1px solid rgba(43, 156, 174, 0.1)'
        }}>
          <TableChart sx={{ fontSize: 48, color: 'rgba(43, 156, 174, 0.4)', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
            Configure a query in the 'Table Setup' tab and execute it to see results
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Card>
      <CardContent>
        {isEditMode && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChart color="primary" />
                Enhanced Table Component
              </Typography>
              
              <Tooltip title="Save Configuration">
                <IconButton onClick={() => setSaveDialog(true)} size="small">
                  <Save />
                </IconButton>
              </Tooltip>
            </Box>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab icon={<Settings />} label="Table Setup" />
              <Tab icon={<ViewColumn />} label="Column Config" />
              <Tab icon={<Visibility />} label="Preview" />
            </Tabs>

            {activeTab === 0 && renderDataConfig()}
            {activeTab === 1 && renderColumnConfig()}
            {activeTab === 2 && renderDataPreview()}
          </>
        )}
        
        {!isEditMode && renderDataPreview()}
      </CardContent>

      {/* Configuration Dialogs */}
      {isEditMode && (
        <>
          {/* Save Configuration Dialog */}
          <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
            <DialogTitle>Save Table Configuration</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary">
                This will save the current table configuration including data source, column settings, and custom queries to both the PropertyInspector and the design collection.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
              <Button 
                onClick={async () => {
                  const success = await saveConfiguration();
                  if (success) {
                    setSaveDialog(false);
                  }
                }} 
                variant="contained"
              >
                Save Configuration
              </Button>
            </DialogActions>
          </Dialog>

          {/* Save Query Dialog */}
          <Dialog open={saveQueryDialog} onClose={() => setSaveQueryDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Save Data Configuration</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Configuration Name"
                fullWidth
                variant="outlined"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Enter a descriptive name for this configuration"
                sx={{ mb: 2 }}
              />
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Configuration to Save:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Data Source:</strong> {dataSources.find(ds => ds.value === dataState.source)?.label}
                </Typography>
                {dataState.source === 'custom_query' && dataState.query && (
                  <Typography variant="body2" component="pre" sx={{ 
                    fontSize: '0.75rem', 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    maxHeight: 200,
                    overflow: 'auto',
                    mt: 1,
                    bgcolor: 'grey.100',
                    p: 1,
                    borderRadius: 1
                  }}>
                    {dataState.query}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSaveQueryDialog(false)}>Cancel</Button>
              <Button 
                onClick={saveCustomQuery} 
                variant="contained"
                disabled={!queryName.trim()}
              >
                Save Configuration
              </Button>
            </DialogActions>
          </Dialog>

          {/* Load Query Dialog */}
          <Dialog open={loadQueryDialog} onClose={() => setLoadQueryDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Load Saved Configuration</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Select a saved data configuration to load:
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {savedQueries.map((query) => (
                  <ListItem key={query.id} divider>
                    <ListItemText
                      primary={query.name}
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Type: {dataSources.find(ds => ds.value === query.queryType)?.label || query.queryType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            Created: {new Date(query.createdAt).toLocaleString()}
                          </Typography>
                          {query.lastUsed && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                              Last used: {new Date(query.lastUsed).toLocaleString()}
                            </Typography>
                          )}
                          {query.queryType === 'custom_query' && (
                            <Typography variant="body2" component="pre" sx={{ 
                              fontSize: '0.7rem', 
                              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                              mt: 0.5,
                              maxHeight: 80,
                              overflow: 'auto',
                              bgcolor: 'grey.100',
                              p: 0.5,
                              borderRadius: 0.5
                            }}>
                              {query.query}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => loadSavedQuery(query)}
                        >
                          Load
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => deleteSavedQuery(query.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              {savedQueries.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No saved configurations available. Save your first configuration to get started.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLoadQueryDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      
      {/* Column Configuration Dialog */}
      {renderColumnConfigDialog()}
    </Card>
  );
};

export default EnhancedTableComponent;
