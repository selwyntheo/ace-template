import { useState, useEffect, useCallback, useRef } from 'react';
import dataService from '../services/dataService';

/**
 * Custom hook for managing component data actions
 * @param {Object} element - The canvas element with data actions
 * @param {Object} options - Hook options
 * @returns {Object} - Data actions state and methods
 */
export const useDataActions = (element, options = {}) => {
  const {
    autoExecute = true,
    executeOnMount = true,
    context = {},
  } = options;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [actionResults, setActionResults] = useState([]);
  
  const elementRef = useRef(element);
  const mountedRef = useRef(false);

  // Update element reference
  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  // Execute action
  const executeAction = useCallback(async (action, actionContext = {}) => {
    if (!action) return null;

    setLoading(true);
    setError(null);

    try {
      const mergedContext = {
        ...context,
        ...actionContext,
        element: elementRef.current,
      };

      const result = await dataService.executeAction(action, mergedContext);
      
      // Update component data based on action type
      if (action.type === 'fetch') {
        setData(result);
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [context]);

  // Execute all data actions
  const executeAllActions = useCallback(async (parallel = false) => {
    const actions = elementRef.current?.dataActions || [];
    if (actions.length === 0) return [];

    setLoading(true);
    setError(null);

    try {
      const results = parallel 
        ? await dataService.executeActionsParallel(actions, context)
        : await dataService.executeActions(actions, context);

      setActionResults(results);

      // Update data with fetch results
      const fetchResults = results
        .filter((result, index) => result.success && actions[index].type === 'fetch')
        .map(result => result.data);

      if (fetchResults.length > 0) {
        setData(fetchResults.length === 1 ? fetchResults[0] : fetchResults);
      }

      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [context]);

  // Execute specific action by type
  const executeActionByType = useCallback(async (actionType, additionalContext = {}) => {
    const actions = elementRef.current?.dataActions || [];
    const action = actions.find(a => a.type === actionType);
    
    if (!action) {
      throw new Error(`No action found with type: ${actionType}`);
    }

    return executeAction(action, additionalContext);
  }, [executeAction]);

  // Refresh data (execute fetch actions)
  const refreshData = useCallback(async () => {
    const actions = elementRef.current?.dataActions || [];
    const fetchActions = actions.filter(action => action.type === 'fetch');
    
    if (fetchActions.length === 0) return null;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        fetchActions.map(action => dataService.executeAction(action, context))
      );

      const newData = results.length === 1 ? results[0] : results;
      setData(newData);
      return newData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [context]);

  // Handle form submission (for form components)
  const handleSubmit = useCallback(async (formData) => {
    const actions = elementRef.current?.dataActions || [];
    const submitActions = actions.filter(action => 
      action.type === 'create' || action.type === 'update'
    );

    if (submitActions.length === 0) {
      console.warn('No submit actions configured for form');
      return null;
    }

    const submitContext = {
      ...context,
      formData,
    };

    const results = [];
    for (const action of submitActions) {
      try {
        const result = await executeAction(action, submitContext);
        results.push({ success: true, data: result });
      } catch (err) {
        results.push({ success: false, error: err.message });
      }
    }

    return results;
  }, [executeAction, context]);

  // Handle delete operation
  const handleDelete = useCallback(async (itemId) => {
    const actions = elementRef.current?.dataActions || [];
    const deleteActions = actions.filter(action => action.type === 'delete');

    if (deleteActions.length === 0) {
      console.warn('No delete actions configured');
      return null;
    }

    const deleteContext = {
      ...context,
      itemId,
    };

    const results = [];
    for (const action of deleteActions) {
      try {
        // Replace {id} placeholder in endpoint
        const actionWithId = {
          ...action,
          endpoint: action.endpoint.replace('{id}', itemId),
        };
        
        const result = await executeAction(actionWithId, deleteContext);
        results.push({ success: true, data: result });
      } catch (err) {
        results.push({ success: false, error: err.message });
      }
    }

    // Refresh data after successful delete
    const hasSuccessfulDelete = results.some(r => r.success);
    if (hasSuccessfulDelete) {
      await refreshData();
    }

    return results;
  }, [executeAction, refreshData, context]);

  // Execute actions on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      
      if (executeOnMount && autoExecute) {
        const actions = element?.dataActions || [];
        const mountActions = actions.filter(action => 
          action.type === 'fetch' || action.executeOnMount
        );

        if (mountActions.length > 0) {
          executeAllActions().catch(err => {
            console.error('Error executing mount actions:', err);
          });
        }
      }
    }
  }, [element?.dataActions, executeOnMount, autoExecute, executeAllActions]);

  // Get action templates for current component type
  const getActionTemplates = useCallback(() => {
    if (!elementRef.current?.type) return [];
    return dataService.getActionTemplates(elementRef.current.type);
  }, []);

  // Clear cache for this component
  const clearCache = useCallback(() => {
    const cacheKey = elementRef.current?.id;
    if (cacheKey) {
      dataService.clearCache(cacheKey);
    }
  }, []);

  return {
    // State
    loading,
    data,
    error,
    actionResults,
    
    // Methods
    executeAction,
    executeAllActions,
    executeActionByType,
    refreshData,
    handleSubmit,
    handleDelete,
    getActionTemplates,
    clearCache,
    
    // Utils
    hasActions: (element?.dataActions || []).length > 0,
    hasFetchActions: (element?.dataActions || []).some(a => a.type === 'fetch'),
    hasSubmitActions: (element?.dataActions || []).some(a => 
      a.type === 'create' || a.type === 'update'
    ),
    hasDeleteActions: (element?.dataActions || []).some(a => a.type === 'delete'),
  };
};

/**
 * Hook for component-specific data action patterns
 * @param {string} componentType - Type of component (table, form, etc.)
 * @param {Object} element - Canvas element
 * @param {Object} options - Additional options
 * @returns {Object} - Component-specific data methods
 */
export const useComponentDataActions = (componentType, element, options = {}) => {
  const dataActions = useDataActions(element, options);

  // Table-specific methods
  const tableActions = {
    loadTableData: () => dataActions.executeActionByType('fetch'),
    deleteRow: (rowId) => dataActions.handleDelete(rowId),
    refreshTable: () => dataActions.refreshData(),
  };

  // Form-specific methods
  const formActions = {
    submitForm: (formData) => dataActions.handleSubmit(formData),
    loadFormData: (id) => dataActions.executeActionByType('fetch', { id }),
    resetForm: () => dataActions.clearCache(),
  };

  // List-specific methods
  const listActions = {
    loadItems: () => dataActions.executeActionByType('fetch'),
    refreshList: () => dataActions.refreshData(),
  };

  // Select-specific methods
  const selectActions = {
    loadOptions: () => dataActions.executeActionByType('fetch'),
    searchOptions: (query) => dataActions.executeActionByType('search', { query }),
  };

  // Chart-specific methods
  const chartActions = {
    loadChartData: () => dataActions.executeActionByType('fetch'),
    refreshChart: () => dataActions.refreshData(),
  };

  const componentSpecific = {
    table: tableActions,
    form: formActions,
    list: listActions,
    select: selectActions,
    autocomplete: selectActions,
    chart: chartActions,
  };

  return {
    ...dataActions,
    ...(componentSpecific[componentType.toLowerCase()] || {}),
  };
};

export default useDataActions;
