import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState(isEditMode ? 0 : 1); // Start with Preview tab in view mode, Setup tab in edit mode
  const [dataState, setDataState] = useState({
    source: 'projects',
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

  const dataStateRef = useRef(dataState);

  const [queryDialog, setQueryDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [columnSelectionDialog, setColumnSelectionDialog] = useState(false);
  const [columnConfigDialog, setColumnConfigDialog] = useState(false);
  const [selectedColumnForConfig, setSelectedColumnForConfig] = useState(null);
  const [columnConfigs, setColumnConfigs] = useState({});
  const [customQueryDialog, setCustomQueryDialog] = useState(false);
  const [queryMode, setQueryMode] = useState('simple'); // 'simple' or 'advanced'
  const [customQuery, setCustomQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
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
      description: 'Execute custom database queries (MongoDB, SQL-like syntax)',
      useGenericApi: false
    },
    { 
      value: 'mongodb_query', 
      label: 'MongoDB Query', 
      endpoint: '/mongo/query',
      description: 'Execute native MongoDB queries with aggregation pipeline',
      useGenericApi: true
    },
    { 
      value: 'sql_query', 
      label: 'SQL-like Query', 
      endpoint: '/sql/query',
      description: 'Execute SQL-like queries translated to MongoDB',
      useGenericApi: true
    }
  ];

  // Keep ref updated with current dataState
  useEffect(() => {
    dataStateRef.current = dataState;
  }, [dataState]);

  // Execute query against backend
  const executeQuery = useCallback(async () => {
    setDataState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let results = [];
      let columns = [];
      
      // Get current state values at execution time
      const currentDataState = dataStateRef.current;
      
      switch (currentDataState.source) {
        case 'projects':
          results = await designApi.getAllDesigns(); // Backend uses designs API for projects
          columns = generateColumnsFromData(results, 'projects');
          break;
          
        case 'account_balances':
        case 'chart_of_accounts':
        case 'distributions':
        case 'fund_info':
        case 'journal_entries':
        case 'nav_history':
        case 'share_transactions':
          results = await fetchCollectionData(currentDataState.source);
          columns = generateColumnsFromData(results, 'collection');
          break;
          
        case 'custom':
          if (currentDataState.query.trim()) {
            // For demo, we'll execute predefined queries
            results = await executeCustomQuery(currentDataState.query);
            columns = generateColumnsFromData(results, 'custom');
          } else {
            throw new Error('Custom query is required');
          }
          break;

        case 'mongodb_query':
          if (currentDataState.query.trim()) {
            results = await executeMongoQuery(currentDataState.query);
            columns = generateColumnsFromData(results, 'custom');
          } else {
            throw new Error('MongoDB query is required');
          }
          break;

        case 'sql_query':
          if (currentDataState.query.trim()) {
            results = await executeSQLQuery(currentDataState.query);
            columns = generateColumnsFromData(results, 'custom');
          } else {
            throw new Error('SQL query is required');
          }
          break;
          
        default:
          throw new Error(`Unsupported data source: ${currentDataState.source}`);
      }

      // Deduplicate results to prevent duplicate keys, but preserve version differences
      const uniqueResults = results.filter((row, index, self) => {
        // For projects with versions, include version in uniqueness check
        if (currentDataState.source === 'projects' && row.version) {
          const rowIdentifier = `${row.id || row._id}_v${row.version}`;
          return index === self.findIndex(r => {
            const rIdentifier = `${r.id || r._id}_v${r.version}`;
            return rIdentifier === rowIdentifier;
          });
        }
        
        // For other data sources, use standard deduplication
        const rowId = row.id || row._id || JSON.stringify(row);
        return index === self.findIndex(r => {
          const rId = r.id || r._id || JSON.stringify(r);
          return rId === rowId;
        });
      });

      setDataState(prev => ({
        ...prev,
        results: uniqueResults,
        columns,
        availableColumns: columns,
        selectedColumns: advancedOptions.showAllColumns ? columns.map(col => col.field) : prev.selectedColumns.filter(field => columns.some(col => col.field === field)),
        loading: false,
        lastFetched: new Date().toISOString(),
        totalRows: uniqueResults.length
      }));
      
    } catch (error) {
      console.error('Query execution error:', error);
      setDataState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, []); // Remove dataState dependency to avoid circular dependency

  // Initialize component data from saved configuration
  useEffect(() => {
    if (component?.properties?.dataConfig) {
      console.log('Initializing table with saved config:', component.properties.dataConfig);
      setDataState(prev => ({
        ...prev,
        source: component.properties.dataConfig.source || prev.source,
        query: component.properties.dataConfig.query || prev.query, // Ensure query is restored
        results: component.properties.dataConfig.results || prev.results,
        columns: component.properties.dataConfig.columns || prev.columns,
        availableColumns: component.properties.dataConfig.availableColumns || prev.availableColumns,
        selectedColumns: component.properties.dataConfig.selectedColumns || prev.selectedColumns,
        lastFetched: component.properties.dataConfig.lastFetched || prev.lastFetched,
        totalRows: component.properties.dataConfig.totalRows || prev.totalRows,
        page: component.properties.dataConfig.page || prev.page,
        pageSize: component.properties.dataConfig.pageSize || prev.pageSize,
        // Preserve loading and error state from current state
        loading: prev.loading,
        error: component.properties.dataConfig.error || prev.error
      }));
    }
    if (component?.properties?.advancedOptions) {
      setAdvancedOptions(prev => ({
        ...prev,
        ...component.properties.advancedOptions
      }));
    }
    if (component?.properties?.columnConfigs) {
      setColumnConfigs(component.properties.columnConfigs);
    }
  }, [component]);

  // Auto-load data in preview mode - prioritize executing fresh queries for better UX
  useEffect(() => {
    if (!isEditMode && component?.properties?.dataConfig) {
      const savedConfig = component.properties.dataConfig;
      
      console.log('Preview mode - initializing with config:', savedConfig);
      
      // Always try to execute fresh query in preview mode for up-to-date data
      if (savedConfig.source) {
        // First set the saved configuration
        setDataState(prev => ({
          ...prev,
          source: savedConfig.source,
          query: savedConfig.query || '',
          selectedColumns: savedConfig.selectedColumns || [],
          availableColumns: savedConfig.availableColumns || [],
          columns: savedConfig.columns || []
        }));
        
        // Then execute query for fresh data (with a small delay to ensure state is set)
        setTimeout(() => {
          console.log('Executing fresh query in preview mode for source:', savedConfig.source);
          executeQuery();
        }, 200);
      } else if (savedConfig.results && savedConfig.results.length > 0) {
        // Fallback to saved results if no source is configured
        console.log('Using saved results as fallback in preview mode:', savedConfig.results.length, 'rows');
        setDataState(prev => ({
          ...prev,
          results: savedConfig.results,
          columns: savedConfig.columns || [],
          availableColumns: savedConfig.availableColumns || [],
          selectedColumns: savedConfig.selectedColumns || []
        }));
      }
    }
  }, [isEditMode, component?.properties?.dataConfig, executeQuery]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (advancedOptions.autoRefresh && advancedOptions.refreshInterval > 0) {
      interval = setInterval(() => {
        // Use a reference to avoid circular dependency
        const currentExecuteQuery = executeQuery;
        currentExecuteQuery();
      }, advancedOptions.refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [advancedOptions.autoRefresh, advancedOptions.refreshInterval, executeQuery]);

  // Update component properties when data state changes (with debouncing to prevent loops)
  const configUpdateTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (!onPropertyChange) return;
    
    // Clear existing timeout
    if (configUpdateTimeoutRef.current) {
      clearTimeout(configUpdateTimeoutRef.current);
    }
    
    // Debounce the config update to prevent rapid changes
    configUpdateTimeoutRef.current = setTimeout(() => {
      const configToSave = {
        ...component?.properties,
        dataConfig: {
          source: dataState.source,
          query: dataState.query,
          results: dataState.results,
          columns: dataState.columns,
          availableColumns: dataState.availableColumns,
          selectedColumns: dataState.selectedColumns,
          lastFetched: dataState.lastFetched,
          totalRows: dataState.totalRows,
          page: dataState.page,
          pageSize: dataState.pageSize,
          error: dataState.error
        },
        advancedOptions: advancedOptions,
        columnConfigs: columnConfigs
      };
      
      // Only update if there are actual changes
      const currentConfig = component?.properties?.dataConfig;
      const hasChanges = JSON.stringify(currentConfig) !== JSON.stringify(configToSave.dataConfig);
      
      if (hasChanges) {
        console.log('Saving table configuration:', configToSave.dataConfig);
        onPropertyChange('properties', configToSave);
      }
    }, 500); // 500ms debounce
    
    return () => {
      if (configUpdateTimeoutRef.current) {
        clearTimeout(configUpdateTimeoutRef.current);
      }
    };
  }, [dataState, advancedOptions, columnConfigs, component?.id]); // Use component.id instead of properties

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
      case 'projects':
        columns.push(
          { field: 'id', headerName: 'Project ID', width: 200, sortable: true },
          { 
            field: 'name', 
            headerName: 'Project Name', 
            width: 250, 
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

    return columns;
  };

  // Get filtered columns based on user selection
  const getDisplayColumns = () => {
    let columns = dataState.columns;
    
    // Apply column configurations
    columns = columns.map(column => {
      const config = columnConfigs[column.field];
      return config ? applyColumnConfig(column, config) : column;
    });
    
    // Filter by column selection if enabled
    if (advancedOptions.columnSelection && !advancedOptions.showAllColumns) {
      columns = columns.filter(col => dataState.selectedColumns.includes(col.field));
    }
    
    // Filter out hidden columns
    columns = columns.filter(col => !col.hide);
    
    return columns;
  };

  // Handle column configuration
  const openColumnConfig = (column) => {
    setSelectedColumnForConfig(column);
    setColumnConfigDialog(true);
  };

  const updateColumnConfig = (columnField, config) => {
    setColumnConfigs(prev => ({
      ...prev,
      [columnField]: {
        ...prev[columnField],
        ...config
      }
    }));
  };

  const applyColumnConfig = (column, config) => {
    return {
      ...column,
      headerName: config?.displayName || column.headerName,
      width: config?.width || column.width,
      sortable: config?.sortable !== undefined ? config.sortable : column.sortable,
      editable: config?.editable !== undefined ? config.editable : column.editable,
      hide: config?.hidden || false,
      align: config?.alignment || 'left',
      headerAlign: config?.headerAlignment || 'left',
      type: config?.dataType || column.type || 'string',
      renderCell: config?.customRenderer ? undefined : column.renderCell, // Reset custom renderer if needed
      valueFormatter: config?.formatter ? (params) => {
        switch (config.formatter) {
          case 'currency':
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value);
          case 'percentage':
            return `${(params.value * 100).toFixed(2)}%`;
          case 'date':
            return new Date(params.value).toLocaleDateString();
          case 'datetime':
            return new Date(params.value).toLocaleString();
          default:
            return params.value;
        }
      } : column.valueFormatter
    };
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

  // Execute MongoDB query
  const executeMongoQuery = async (query) => {
    try {
      // Parse the query to extract collection and pipeline
      let parsedQuery;
      try {
        parsedQuery = JSON.parse(query);
      } catch (e) {
        throw new Error('Invalid JSON format. Please provide a valid MongoDB query.');
      }

      const { collection, pipeline = [], find = {} } = parsedQuery;
      
      if (!collection) {
        throw new Error('Collection name is required in the query object.');
      }

      // Determine which type of query to execute
      let endpoint;
      let body;
      
      if (pipeline && pipeline.length > 0) {
        // Aggregation pipeline
        endpoint = `/mongo/collections/${collection}/aggregate`;
        body = { pipeline };
      } else {
        // Simple find query
        endpoint = `/mongo/collections/${collection}/find`;
        body = { filter: find };
      }

      const response = await fetch(`http://localhost:8080/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'custom-query-user'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Query failed: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || [result];
    } catch (error) {
      console.error('MongoDB query execution error:', error);
      throw error;
    }
  };

  // Execute SQL-like query
  const executeSQLQuery = async (query) => {
    try {
      const response = await fetch(`http://localhost:8080/api/sql/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'sql-query-user'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`SQL query failed: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result : result.data || [result];
    } catch (error) {
      console.error('SQL query execution error:', error);
      throw error;
    }
  };

  // Save query to history
  const saveQueryToHistory = (query, queryType) => {
    const historyEntry = {
      id: Date.now(),
      query,
      queryType,
      timestamp: new Date().toISOString(),
      description: query.substring(0, 100) + (query.length > 100 ? '...' : '')
    };
    
    setQueryHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 queries
  };

  // Load query from history
  const loadQueryFromHistory = (historyEntry) => {
    setDataState(prev => ({ 
      ...prev, 
      query: historyEntry.query, 
      source: historyEntry.queryType 
    }));
    setQueryMode('simple');
  };

  // Get query placeholder based on source
  const getQueryPlaceholder = () => {
    switch (dataState.source) {
      case 'mongodb_query':
        return `{
  "collection": "account_balances",
  "pipeline": [
    { "$match": { "balance": { "$gt": 1000 } } },
    { "$group": { "_id": "$accountType", "totalBalance": { "$sum": "$balance" } } }
  ]
}`;
      case 'sql_query':
        return `SELECT accountType, SUM(balance) as totalBalance 
FROM account_balances 
WHERE balance > 1000 
GROUP BY accountType
ORDER BY totalBalance DESC`;
      case 'custom':
        return `Enter query: 'public designs', 'recent designs', 'count summary'`;
      default:
        return '';
    }
  };

  // Insert sample MongoDB query
  const insertSampleMongoQuery = () => {
    const sampleQuery = `{
  "collection": "fund_info",
  "pipeline": [
    { "$match": { "status": "active" } },
    { "$group": { 
        "_id": "$fundType", 
        "count": { "$sum": 1 },
        "totalAssets": { "$sum": "$totalAssets" }
      }
    },
    { "$sort": { "totalAssets": -1 } }
  ]
}`;
    setDataState(prev => ({ ...prev, query: sampleQuery }));
  };

  // Insert sample SQL query
  const insertSampleSQLQuery = () => {
    const sampleQuery = `SELECT 
  fundType, 
  COUNT(*) as count, 
  SUM(totalAssets) as totalAssets
FROM fund_info 
WHERE status = 'active'
GROUP BY fundType
ORDER BY totalAssets DESC`;
    setDataState(prev => ({ ...prev, query: sampleQuery }));
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
        setDataState(prev => ({
          ...prev,
          ...reloadedComponent.properties.dataConfig
        }));
        if (reloadedComponent.properties.advancedOptions) {
          setAdvancedOptions(prev => ({
            ...prev,
            ...reloadedComponent.properties.advancedOptions
          }));
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

      // If we're editing projects data, attempt to save to backend
      if (dataState.source === 'projects') {
        const endpoint = '/api/projects';
        
        const response = await fetch(`http://localhost:8080${endpoint}/${newRow.id}`, {
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
        
        console.log(`Successfully updated ${changedField} for project ${newRow.id}`);
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

      // If we're editing projects data, attempt to save to backend
      if (dataState.source === 'projects') {
        const endpoint = '/api/projects';
        const rowData = dataState.results.find(row => row.id === id);
        
        if (rowData) {
          const updatedRow = { ...rowData, [field]: value };
          
          const response = await fetch(`http://localhost:8080${endpoint}/${id}`, {
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
          
          console.log(`Successfully updated ${field} for project ${id}`);
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

        {(dataState.source === 'custom' || dataState.source === 'mongodb_query' || dataState.source === 'sql_query') && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2">
                {dataState.source === 'mongodb_query' && 'MongoDB Query'}
                {dataState.source === 'sql_query' && 'SQL-like Query'}
                {dataState.source === 'custom' && 'Custom Query'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setCustomQueryDialog(true)}
                >
                  Query Builder
                </Button>
                {queryHistory.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setCustomQueryDialog(true)}
                  >
                    History ({queryHistory.length})
                  </Button>
                )}
              </Box>
            </Box>
            
            <TextField
              label={
                dataState.source === 'mongodb_query' 
                  ? 'MongoDB Query (JSON format)'
                  : dataState.source === 'sql_query'
                  ? 'SQL Query'
                  : 'Custom Query'
              }
              multiline
              rows={6}
              fullWidth
              value={dataState.query}
              onChange={(e) => setDataState(prev => ({ ...prev, query: e.target.value }))}
              placeholder={getQueryPlaceholder()}
              size="small"
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '0.875rem'
                }
              }}
            />
            
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  executeQuery();
                  saveQueryToHistory(dataState.query, dataState.source);
                }}
                disabled={!dataState.query.trim() || dataState.loading}
              >
                Execute Query
              </Button>
              <Button
                size="small"
                onClick={() => setDataState(prev => ({ ...prev, query: '' }))}
              >
                Clear
              </Button>
              {dataState.source === 'mongodb_query' && (
                <Button
                  size="small"
                  onClick={() => insertSampleMongoQuery()}
                >
                  Sample Query
                </Button>
              )}
              {dataState.source === 'sql_query' && (
                <Button
                  size="small"
                  onClick={() => insertSampleSQLQuery()}
                >
                  Sample Query
                </Button>
              )}
            </Box>
          </Grid>
        )}

        {dataState.source === 'custom' && queryMode === 'simple' && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Simple Query Mode:</strong> Use predefined query patterns like "public designs", "recent designs", or "count summary"
              </Typography>
            </Alert>
            <TextField
              label="Simple Query"
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

  // Render data preview tab - Clean preview without configuration controls
  const renderDataPreview = () => (
    <Box sx={{ p: isEditMode ? 2 : 0 }}>
      {dataState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {dataState.error}
        </Alert>
      )}
      
      {/* Show loading indicator */}
      {dataState.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading data...</Typography>
        </Box>
      )}
      
      {/* Show data table if results are available */}
      {!dataState.loading && dataState.results.length > 0 && (
        <Box>
          {/* Info bar - only show in edit mode */}
          {isEditMode && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {dataState.results.length} rows from {dataState.source}
                {dataState.lastFetched && ` • Last updated: ${new Date(dataState.lastFetched).toLocaleString()}`}
              </Typography>
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={executeQuery}
                disabled={dataState.loading}
              >
                Refresh
              </Button>
            </Box>
          )}
          
          {/* Clean data table without configuration controls */}
          <DataGrid
            rows={dataState.results}
            columns={getDisplayColumns()}
            pageSize={dataState.pageSize}
            loading={dataState.loading}
            getRowId={(row, index) => {
              // Ensure index is defined
              const safeIndex = index !== undefined ? index : Math.random().toString(36).substr(2, 9);
              
              // First priority: standard id field
              if (row.id) return `id_${row.id}`;
              
              // Second priority: MongoDB _id field
              if (row._id) {
                // Handle MongoDB ObjectId (could be string or object)
                if (typeof row._id === 'string') return `oid_${row._id}`;
                if (row._id.$oid) return `oid_${row._id.$oid}`;
                if (row._id.timestamp) {
                  // Combine timestamp with other unique identifiers to avoid duplicates
                  const timestamp = row._id.timestamp.toString();
                  const dateStr = row._id.date ? row._id.date.toString() : 'nodate';
                  return `ts_${timestamp}_${dateStr}_${safeIndex}`;
                }
                return `obj_${JSON.stringify(row._id)}_${safeIndex}`;
              }
              
              // Third priority: business key (like fund_code)
              if (row.fund_code) return `fund_${row.fund_code}_${safeIndex}`;
              
              // Fourth priority: combination of available fields
              const keys = Object.keys(row);
              if (keys.length > 0) {
                const firstValue = row[keys[0]];
                return `field_${keys[0]}_${firstValue}_${safeIndex}`;
              }
              
              // Last resort: index-based ID
              return `row_${safeIndex}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            }}
            checkboxSelection={isEditMode && advancedOptions.rowSelection === 'multiple'}
            disableSelectionOnClick={!isEditMode}
            sortingOrder={['desc', 'asc']}
            pagination
            pageSizeOptions={[5, 10, 25, 50]}
            onPageSizeChange={(newPageSize) => 
              setDataState(prev => ({ ...prev, pageSize: newPageSize }))
            }
            processRowUpdate={isEditMode ? processRowUpdate : undefined}
            onProcessRowUpdateError={isEditMode ? handleProcessRowUpdateError : undefined}
            onCellEditCommit={isEditMode ? handleCellEditCommit : undefined}
            experimentalFeatures={{ newEditingApi: isEditMode }}
            sx={{
              height: isEditMode ? 400 : 'auto',
              minHeight: 300,
              '& .MuiDataGrid-root': {
                border: 'none'
              }
            }}
          />
        </Box>
      )}
      
      {/* Show empty state if no data */}
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
            {isEditMode 
              ? "Configure a data source in the 'Table Setup' tab and execute a query to see results"
              : "This table has no data to display"
            }
          </Typography>
          {isEditMode && dataState.source && !dataState.loading && (
            <Button
              variant="outlined"
              startIcon={<PlayArrow />}
              onClick={executeQuery}
              sx={{ mt: 2 }}
            >
              Execute Query
            </Button>
          )}
        </Box>
      )}
    </Box>
  );

  // Render column configuration tab - Better UX with table format
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
                  const config = columnConfigs[column.field] || {};
                  const isVisible = dataState.selectedColumns.includes(column.field);
                  
                  return (
                    <tr 
                      key={column.field}
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
                          onChange={(e) => {
                            setColumnConfigs(prev => ({
                              ...prev,
                              [column.field]: {
                                ...prev[column.field],
                                displayName: e.target.value
                              }
                            }));
                          }}
                          sx={{ minWidth: 120 }}
                        />
                      </td>
                      <td style={{ padding: '8px' }}>
                        <TextField
                          size="small"
                          type="number"
                          variant="outlined"
                          value={config.width || column.width || 150}
                          onChange={(e) => {
                            setColumnConfigs(prev => ({
                              ...prev,
                              [column.field]: {
                                ...prev[column.field],
                                width: parseInt(e.target.value) || 150
                              }
                            }));
                          }}
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
              <Chip 
                label="Column Selection" 
                color={advancedOptions.columnSelection ? 'primary' : 'default'}
                onClick={() => setAdvancedOptions(prev => ({ 
                  ...prev, 
                  columnSelection: !prev.columnSelection 
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
        {isEditMode && (
          <>
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
              <Tab icon={<Settings />} label="Table Setup" />
              <Tab icon={<Visibility />} label="Preview" />
              <Tab icon={<ViewColumn />} label="Column Config" />
              <Tab icon={<Code />} label="Advanced" />
            </Tabs>

            {activeTab === 0 && renderDataConfig()}
            {activeTab === 1 && renderDataPreview()}
            {activeTab === 2 && renderColumnConfig()}
            {activeTab === 3 && renderAdvancedOptions()}
          </>
        )}
        
        {!isEditMode && renderDataPreview()}
      </CardContent>

      {/* Configuration Dialogs - Only show in edit mode */}
      {isEditMode && (
        <>
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

      {/* Column Configuration Dialog */}
      <Dialog 
        open={columnConfigDialog} 
        onClose={() => setColumnConfigDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure Column: {selectedColumnForConfig?.headerName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Name"
                  fullWidth
                  value={columnConfigs[selectedColumnForConfig?.field]?.displayName || selectedColumnForConfig?.headerName || ''}
                  onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { displayName: e.target.value })}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Width (px)"
                  type="number"
                  fullWidth
                  value={columnConfigs[selectedColumnForConfig?.field]?.width || selectedColumnForConfig?.width || 150}
                  onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { width: parseInt(e.target.value) })}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Data Type</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig?.field]?.dataType || selectedColumnForConfig?.type || 'string'}
                    label="Data Type"
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { dataType: e.target.value })}
                  >
                    <MenuItem value="string">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="dateTime">Date Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Formatter</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig?.field]?.formatter || 'none'}
                    label="Formatter"
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { formatter: e.target.value === 'none' ? null : e.target.value })}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="currency">Currency</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="datetime">Date & Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Alignment</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig?.field]?.alignment || 'left'}
                    label="Alignment"
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { alignment: e.target.value })}
                  >
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Header Alignment</InputLabel>
                  <Select
                    value={columnConfigs[selectedColumnForConfig?.field]?.headerAlignment || 'left'}
                    label="Header Alignment"
                    onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { headerAlignment: e.target.value })}
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
                        checked={columnConfigs[selectedColumnForConfig?.field]?.sortable !== undefined 
                          ? columnConfigs[selectedColumnForConfig?.field]?.sortable 
                          : selectedColumnForConfig?.sortable || false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { sortable: e.target.checked })}
                      />
                    }
                    label="Sortable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig?.field]?.editable !== undefined 
                          ? columnConfigs[selectedColumnForConfig?.field]?.editable 
                          : selectedColumnForConfig?.editable || false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { editable: e.target.checked })}
                      />
                    }
                    label="Editable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnConfigs[selectedColumnForConfig?.field]?.hidden || false}
                        onChange={(e) => updateColumnConfig(selectedColumnForConfig?.field, { hidden: e.target.checked })}
                      />
                    }
                    label="Hidden"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnConfigDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              // Reset column configuration
              setColumnConfigs(prev => {
                const newConfigs = { ...prev };
                delete newConfigs[selectedColumnForConfig?.field];
                return newConfigs;
              });
            }}
            color="warning"
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Query Builder Dialog */}
      <Dialog 
        open={customQueryDialog} 
        onClose={() => setCustomQueryDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Query Builder & History</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Query Type</InputLabel>
              <Select
                value={dataState.source}
                label="Query Type"
                onChange={(e) => setDataState(prev => ({ ...prev, source: e.target.value, query: '' }))}
              >
                <MenuItem value="custom">Simple Custom</MenuItem>
                <MenuItem value="mongodb_query">MongoDB Query</MenuItem>
                <MenuItem value="sql_query">SQL-like Query</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Tabs value={queryMode} onChange={(e, newValue) => setQueryMode(newValue)}>
              <Tab value="simple" label="Query Editor" />
              <Tab value="advanced" label="Query History" />
              <Tab value="templates" label="Templates" />
            </Tabs>

            {queryMode === 'simple' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label={`${dataState.source === 'mongodb_query' ? 'MongoDB' : dataState.source === 'sql_query' ? 'SQL' : 'Custom'} Query`}
                      multiline
                      rows={12}
                      fullWidth
                      value={dataState.query}
                      onChange={(e) => setDataState(prev => ({ ...prev, query: e.target.value }))}
                      placeholder={getQueryPlaceholder()}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {dataState.source === 'mongodb_query' && (
                        <>
                          <Button size="small" onClick={() => insertSampleMongoQuery()}>
                            Sample Aggregation
                          </Button>
                          <Button 
                            size="small" 
                            onClick={() => setDataState(prev => ({ 
                              ...prev, 
                              query: `{ "collection": "fund_info", "find": { "status": "active" } }` 
                            }))}
                          >
                            Simple Find
                          </Button>
                        </>
                      )}
                      {dataState.source === 'sql_query' && (
                        <>
                          <Button size="small" onClick={() => insertSampleSQLQuery()}>
                            Sample SELECT
                          </Button>
                          <Button 
                            size="small" 
                            onClick={() => setDataState(prev => ({ 
                              ...prev, 
                              query: `SELECT * FROM fund_info LIMIT 10` 
                            }))}
                          >
                            Simple SELECT
                          </Button>
                        </>
                      )}
                      <Button 
                        size="small" 
                        color="warning"
                        onClick={() => setDataState(prev => ({ ...prev, query: '' }))}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {queryMode === 'advanced' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Query History</Typography>
                {queryHistory.length > 0 ? (
                  <Grid container spacing={2}>
                    {queryHistory.map((historyItem) => (
                      <Grid item xs={12} key={historyItem.id}>
                        <Card variant="outlined">
                          <CardContent sx={{ pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                              <Typography variant="subtitle2">
                                {historyItem.queryType.replace('_', ' ').toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(historyItem.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                bgcolor: 'rgba(0,0,0,0.05)',
                                p: 1,
                                borderRadius: 1,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {historyItem.description}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ pt: 0 }}>
                            <Button
                              size="small"
                              onClick={() => loadQueryFromHistory(historyItem)}
                            >
                              Load Query
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              onClick={() => setQueryHistory(prev => prev.filter(item => item.id !== historyItem.id))}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No query history available</Typography>
                  </Box>
                )}
              </Box>
            )}

            {queryMode === 'templates' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Query Templates</Typography>
                <Grid container spacing={2}>
                  {/* MongoDB Templates */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>MongoDB Templates</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "fund_info",
  "pipeline": [
    { "$group": { "_id": "$status", "count": { "$sum": 1 } } }
  ]
}`
                              }));
                            }}
                          >
                            Group By Status
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "account_balances",
  "pipeline": [
    { "$match": { "balance": { "$gte": 1000 } } },
    { "$sort": { "balance": -1 } },
    { "$limit": 10 }
  ]
}`
                              }));
                            }}
                          >
                            Top 10 Balances
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "nav_history",
  "pipeline": [
    { "$match": { "date": { "$gte": "2024-01-01" } } },
    { "$group": { 
        "_id": { 
          "$dateToString": { "format": "%Y-%m", "date": "$date" }
        },
        "avgNav": { "$avg": "$nav" }
      }
    }
  ]
}`
                              }));
                            }}
                          >
                            Monthly Average NAV
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* SQL Templates */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>SQL Templates</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT status, COUNT(*) as count
FROM fund_info
GROUP BY status
ORDER BY count DESC`
                              }));
                            }}
                          >
                            Count by Status
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT *
FROM account_balances
WHERE balance >= 1000
ORDER BY balance DESC
LIMIT 10`
                              }));
                            }}
                          >
                            Top 10 Balances
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  AVG(nav) as avgNav
FROM nav_history
WHERE date >= '2024-01-01'
GROUP BY month
ORDER BY month`
                              }));
                            }}
                          >
                            Monthly Average NAV
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomQueryDialog(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              if (dataState.query.trim()) {
                executeQuery();
                saveQueryToHistory(dataState.query, dataState.source);
                setCustomQueryDialog(false);
              }
            }}
            disabled={!dataState.query.trim() || dataState.loading}
          >
            Execute Query
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Query Builder Dialog */}
      <Dialog 
        open={customQueryDialog} 
        onClose={() => setCustomQueryDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Query Builder & History</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Query Type</InputLabel>
              <Select
                value={dataState.source}
                label="Query Type"
                onChange={(e) => setDataState(prev => ({ ...prev, source: e.target.value, query: '' }))}
              >
                <MenuItem value="custom">Simple Custom</MenuItem>
                <MenuItem value="mongodb_query">MongoDB Query</MenuItem>
                <MenuItem value="sql_query">SQL-like Query</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Tabs value={queryMode} onChange={(e, newValue) => setQueryMode(newValue)}>
              <Tab value="simple" label="Query Editor" />
              <Tab value="advanced" label="Query History" />
              <Tab value="templates" label="Templates" />
            </Tabs>

            {queryMode === 'simple' && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label={`${dataState.source === 'mongodb_query' ? 'MongoDB' : dataState.source === 'sql_query' ? 'SQL' : 'Custom'} Query`}
                      multiline
                      rows={12}
                      fullWidth
                      value={dataState.query}
                      onChange={(e) => setDataState(prev => ({ ...prev, query: e.target.value }))}
                      placeholder={getQueryPlaceholder()}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {dataState.source === 'mongodb_query' && (
                        <>
                          <Button size="small" onClick={() => insertSampleMongoQuery()}>
                            Sample Aggregation
                          </Button>
                          <Button 
                            size="small" 
                            onClick={() => setDataState(prev => ({ 
                              ...prev, 
                              query: `{ "collection": "fund_info", "find": { "status": "active" } }` 
                            }))}
                          >
                            Simple Find
                          </Button>
                        </>
                      )}
                      {dataState.source === 'sql_query' && (
                        <>
                          <Button size="small" onClick={() => insertSampleSQLQuery()}>
                            Sample SELECT
                          </Button>
                          <Button 
                            size="small" 
                            onClick={() => setDataState(prev => ({ 
                              ...prev, 
                              query: `SELECT * FROM fund_info LIMIT 10` 
                            }))}
                          >
                            Simple SELECT
                          </Button>
                        </>
                      )}
                      <Button 
                        size="small" 
                        color="warning"
                        onClick={() => setDataState(prev => ({ ...prev, query: '' }))}
                      >
                        Clear
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {queryMode === 'advanced' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Query History</Typography>
                {queryHistory.length > 0 ? (
                  <Grid container spacing={2}>
                    {queryHistory.map((historyItem) => (
                      <Grid item xs={12} key={historyItem.id}>
                        <Card variant="outlined">
                          <CardContent sx={{ pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                              <Typography variant="subtitle2">
                                {historyItem.queryType.replace('_', ' ').toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(historyItem.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                bgcolor: 'rgba(0,0,0,0.05)',
                                p: 1,
                                borderRadius: 1,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {historyItem.description}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ pt: 0 }}>
                            <Button
                              size="small"
                              onClick={() => loadQueryFromHistory(historyItem)}
                            >
                              Load Query
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              onClick={() => setQueryHistory(prev => prev.filter(item => item.id !== historyItem.id))}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No query history available</Typography>
                  </Box>
                )}
              </Box>
            )}

            {queryMode === 'templates' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Query Templates</Typography>
                <Grid container spacing={2}>
                  {/* MongoDB Templates */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>MongoDB Templates</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "fund_info",
  "pipeline": [
    { "$group": { "_id": "$status", "count": { "$sum": 1 } } }
  ]
}`
                              }));
                            }}
                          >
                            Group By Status
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "account_balances",
  "pipeline": [
    { "$match": { "balance": { "$gte": 1000 } } },
    { "$sort": { "balance": -1 } },
    { "$limit": 10 }
  ]
}`
                              }));
                            }}
                          >
                            Top 10 Balances
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'mongodb_query',
                                query: `{
  "collection": "nav_history",
  "pipeline": [
    { "$match": { "date": { "$gte": "2024-01-01" } } },
    { "$group": { 
        "_id": { 
          "$dateToString": { "format": "%Y-%m", "date": "$date" }
        },
        "avgNav": { "$avg": "$nav" }
      }
    }
  ]
}`
                              }));
                            }}
                          >
                            Monthly Average NAV
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* SQL Templates */}
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>SQL Templates</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT status, COUNT(*) as count
FROM fund_info
GROUP BY status
ORDER BY count DESC`
                              }));
                            }}
                          >
                            Count by Status
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT *
FROM account_balances
WHERE balance >= 1000
ORDER BY balance DESC
LIMIT 10`
                              }));
                            }}
                          >
                            Top 10 Balances
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setDataState(prev => ({ 
                                ...prev, 
                                source: 'sql_query',
                                query: `SELECT 
  DATE_FORMAT(date, '%Y-%m') as month,
  AVG(nav) as avgNav
FROM nav_history
WHERE date >= '2024-01-01'
GROUP BY month
ORDER BY month`
                              }));
                            }}
                          >
                            Monthly Average NAV
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomQueryDialog(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              if (dataState.query.trim()) {
                executeQuery();
                saveQueryToHistory(dataState.query, dataState.source);
                setCustomQueryDialog(false);
              }
            }}
            disabled={!dataState.query.trim() || dataState.loading}
          >
            Execute Query
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}
    </Card>
  );
};

export default EnhancedTableComponent;
