import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Alert,
  Tabs,
  Tab,
  Paper,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  FormatSize as FormatSizeIcon,
  ViewModule as ViewModuleIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
  Storage as StorageIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Animation as AnimationIcon,
  CheckCircle as CheckCircleIcon,
  TableChart as TableChartIcon,
  Functions as FunctionsIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import DataQueryManager from './DataQueryManager';

const PropertyInspector = ({ selectedElement, onPropertyUpdate }) => {
  // Extract type early for hooks that depend on it
  const type = selectedElement?.type || '';
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    style: false,
    layout: false,
    advanced: false,
    events: false,
    dataActions: false,
    validation: false,
    conditional: false,
    animations: false,
    security: false,
  });

  // Enhanced states for advanced functionality
  const [activeTab, setActiveTab] = useState(0);
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [validationRules, setValidationRules] = useState([]);
  const [conditionalLogic, setConditionalLogic] = useState([]);
  const [animationSettings, setAnimationSettings] = useState({});
  const [securitySettings, setSecuritySettings] = useState({});

  // Dialog states
  const [dataActionDialog, setDataActionDialog] = useState(false);
  const [selectedDataAction, setSelectedDataAction] = useState(null);
  const [dataActionConfig, setDataActionConfig] = useState({
    type: 'fetch',
    endpoint: '',
    method: 'GET',
    params: {},
    headers: {},
    autoExecute: true,
    cacheEnabled: false,
    cacheDuration: 300,
    retryCount: 3,
    timeout: 30000,
  });

  const [validationDialog, setValidationDialog] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [validationConfig, setValidationConfig] = useState({
    type: 'required',
    message: '',
    condition: '',
    regex: '',
    min: null,
    max: null,
    customFunction: '',
  });

  const [conditionalDialog, setConditionalDialog] = useState(false);
  const [selectedConditional, setSelectedConditional] = useState(null);
  const [conditionalConfig, setConditionalConfig] = useState({
    condition: '',
    action: 'show',
    target: 'self',
    value: '',
    operator: 'equals',
    dependsOn: '',
  });

  // Initialize component data from selectedElement
  useEffect(() => {
    if (selectedElement) {
      setValidationRules(selectedElement.validationRules || []);
      setConditionalLogic(selectedElement.conditionalLogic || []);
      setAnimationSettings(selectedElement.animationSettings || {});
      setSecuritySettings(selectedElement.securitySettings || {});
    }
  }, [selectedElement]);

  const handleSectionToggle = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const updateProperty = useCallback((property, value) => {
    if (!selectedElement) return;
    
    onPropertyUpdate({
      properties: {
        ...selectedElement.properties,
        [property]: value,
      },
    });
  }, [selectedElement, onPropertyUpdate]);

  const updateStyle = useCallback((style, value) => {
    if (!selectedElement) return;
    
    onPropertyUpdate({
      styles: {
        ...selectedElement.styles,
        [style]: value,
      },
    });
  }, [selectedElement, onPropertyUpdate]);

  const updateElementProperty = useCallback((property, value) => {
    if (!selectedElement) return;
    
    onPropertyUpdate({
      ...selectedElement,
      [property]: value,
    });
  }, [selectedElement, onPropertyUpdate]);

  // Helper functions
  const getActionTypeColor = (type) => {
    const colors = {
      fetch: 'primary',
      create: 'success',
      update: 'warning',
      delete: 'error',
      search: 'info',
      aggregate: 'secondary',
      stream: 'default'
    };
    return colors[type] || 'default';
  };

  const getActionTriggerDescription = (action, componentType) => {
    if (action.autoExecute) {
      return 'On mount';
    }
    switch (componentType.toLowerCase()) {
      case 'table':
        return 'Manual/Refresh';
      case 'form':
        return 'On submit';
      case 'select':
        return 'On selection';
      default:
        return 'Manual';
    }
  };

  // Render functions
  const renderBasicProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Element ID"
          value={selectedElement.id || ''}
          onChange={(e) => updateElementProperty('id', e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Label/Text"
          value={selectedElement.properties?.text || selectedElement.properties?.label || ''}
          onChange={(e) => updateProperty('text', e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Placeholder"
          value={selectedElement.properties?.placeholder || ''}
          onChange={(e) => updateProperty('placeholder', e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch
              checked={selectedElement.properties?.disabled || false}
              onChange={(e) => updateProperty('disabled', e.target.checked)}
            />
          }
          label="Disabled"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch
              checked={selectedElement.properties?.required || false}
              onChange={(e) => updateProperty('required', e.target.checked)}
            />
          }
          label="Required"
        />
      </Grid>
    </Grid>
  );

  const renderStyleProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Colors
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Background Color"
          type="color"
          value={selectedElement.styles?.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Text Color"
          type="color"
          value={selectedElement.styles?.color || '#000000'}
          onChange={(e) => updateStyle('color', e.target.value)}
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Typography
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Font Size"
          value={selectedElement.styles?.fontSize || '14px'}
          onChange={(e) => updateStyle('fontSize', e.target.value)}
          fullWidth
          size="small"
          placeholder="14px"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Font Weight</InputLabel>
          <Select
            value={selectedElement.styles?.fontWeight || 'normal'}
            onChange={(e) => updateStyle('fontWeight', e.target.value)}
            label="Font Weight"
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="bold">Bold</MenuItem>
            <MenuItem value="lighter">Lighter</MenuItem>
            <MenuItem value="bolder">Bolder</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderLayoutProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Width"
          value={selectedElement.layout?.width || ''}
          onChange={(e) => updateElementProperty('layout', { ...selectedElement.layout, width: e.target.value })}
          fullWidth
          size="small"
          placeholder="auto, 100px, 50%"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Height"
          value={selectedElement.layout?.height || ''}
          onChange={(e) => updateElementProperty('layout', { ...selectedElement.layout, height: e.target.value })}
          fullWidth
          size="small"
          placeholder="auto, 100px, 50%"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Margin"
          value={selectedElement.layout?.margin || ''}
          onChange={(e) => updateElementProperty('layout', { ...selectedElement.layout, margin: e.target.value })}
          fullWidth
          size="small"
          placeholder="10px, 10px 20px"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Padding"
          value={selectedElement.layout?.padding || ''}
          onChange={(e) => updateElementProperty('layout', { ...selectedElement.layout, padding: e.target.value })}
          fullWidth
          size="small"
          placeholder="10px, 10px 20px"
        />
      </Grid>
    </Grid>
  );

  const renderAdvancedProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="CSS Classes"
          value={selectedElement.properties?.className || ''}
          onChange={(e) => updateProperty('className', e.target.value)}
          fullWidth
          size="small"
          placeholder="class1 class2"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Custom Attributes (JSON)"
          value={JSON.stringify(selectedElement.properties?.customAttributes || {}, null, 2)}
          onChange={(e) => {
            try {
              const attrs = JSON.parse(e.target.value);
              updateProperty('customAttributes', attrs);
            } catch (error) {
              // Invalid JSON, ignore for now
            }
          }}
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder='{"data-test": "value", "aria-label": "Label"}'
        />
      </Grid>
    </Grid>
  );

  const renderEventProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Event Handlers
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="On Click"
          value={selectedElement.events?.onClick || ''}
          onChange={(e) => updateElementProperty('events', { ...selectedElement.events, onClick: e.target.value })}
          fullWidth
          multiline
          rows={2}
          size="small"
          placeholder="function() { console.log('clicked'); }"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="On Change"
          value={selectedElement.events?.onChange || ''}
          onChange={(e) => updateElementProperty('events', { ...selectedElement.events, onChange: e.target.value })}
          fullWidth
          multiline
          rows={2}
          size="small"
          placeholder="function(value) { console.log('changed:', value); }"
        />
      </Grid>
    </Grid>
  );

  const renderDataActions = () => {
    const dataActions = selectedElement.dataActions || [];
    const supportsDataActions = ['table', 'list', 'chart', 'form', 'select', 'autocomplete'].includes(type.toLowerCase());
    const isTableComponent = type.toLowerCase() === 'table';

    if (!supportsDataActions) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          Data actions are not supported for this component type.
        </Alert>
      );
    }

    return (
      <>
        {/* Enhanced Table Data Management */}
        {isTableComponent && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableChartIcon />
              Table Data Management
            </Typography>
            
            <DataQueryManager 
              component={selectedElement}
              onPropertyChange={updateElementProperty}
              designId={selectedElement.designId}
            />
            
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Standard Data Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Configure database fetch actions for dynamic data
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDataActionDialog(true)}
            variant="outlined"
          >
            Add Action
          </Button>
        </Box>

        {dataActions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
            <StorageIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No data actions configured
            </Typography>
          </Box>
        ) : (
          <List dense>
            {dataActions.map((action, index) => (
              <ListItem
                key={action.id || index}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper',
                }}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setDataActionConfig(action);
                        setSelectedDataAction(index);
                        setDataActionDialog(true);
                      }}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const updatedActions = dataActions.filter((_, i) => i !== index);
                        updateElementProperty('dataActions', updatedActions);
                      }}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={action.type.toUpperCase()}
                        size="small"
                        color={getActionTypeColor(action.type)}
                        variant="outlined"
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {action.endpoint || 'No endpoint'}
                      </Typography>
                    </Box>
                  }
                  secondary={`Method: ${action.method} | Trigger: ${getActionTriggerDescription(action, type)}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  };

  const renderValidationProperties = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Validation rules for form validation
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setValidationDialog(true)}
          variant="outlined"
        >
          Add Rule
        </Button>
      </Box>
      
      {validationRules.length === 0 ? (
        <Alert severity="info">No validation rules configured</Alert>
      ) : (
        <List dense>
          {validationRules.map((rule, index) => (
            <ListItem key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              <ListItemText
                primary={rule.name || rule.type}
                secondary={rule.message}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderConditionalProperties = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Conditional logic for dynamic behavior
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setConditionalDialog(true)}
          variant="outlined"
        >
          Add Logic
        </Button>
      </Box>
      
      {conditionalLogic.length === 0 ? (
        <Alert severity="info">No conditional logic configured</Alert>
      ) : (
        <List dense>
          {conditionalLogic.map((logic, index) => (
            <ListItem key={index} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              <ListItemText
                primary={`${logic.condition} → ${logic.action}`}
                secondary={`Target: ${logic.target}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  const renderAnimationProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={animationSettings.enabled || false}
              onChange={(e) => setAnimationSettings({ ...animationSettings, enabled: e.target.checked })}
            />
          }
          label="Enable Animations"
        />
      </Grid>
      {animationSettings.enabled && (
        <>
          <Grid item xs={6}>
            <TextField
              label="Animation Duration"
              value={animationSettings.duration || '300ms'}
              onChange={(e) => setAnimationSettings({ ...animationSettings, duration: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Animation Type</InputLabel>
              <Select
                value={animationSettings.type || 'fade'}
                onChange={(e) => setAnimationSettings({ ...animationSettings, type: e.target.value })}
                label="Animation Type"
              >
                <MenuItem value="fade">Fade</MenuItem>
                <MenuItem value="slide">Slide</MenuItem>
                <MenuItem value="scale">Scale</MenuItem>
                <MenuItem value="rotate">Rotate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderSecurityProperties = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={securitySettings.sanitizeInput || false}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sanitizeInput: e.target.checked })}
            />
          }
          label="Sanitize Input"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={securitySettings.preventXSS || false}
              onChange={(e) => setSecuritySettings({ ...securitySettings, preventXSS: e.target.checked })}
            />
          }
          label="Prevent XSS"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Required Permissions"
          value={securitySettings.permissions || ''}
          onChange={(e) => setSecuritySettings({ ...securitySettings, permissions: e.target.value })}
          fullWidth
          size="small"
          placeholder="read, write, admin"
        />
      </Grid>
    </Grid>
  );

  // Data Action Dialog
  const renderDataActionDialog = () => (
    <Dialog open={dataActionDialog} onClose={() => setDataActionDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedDataAction !== null ? 'Edit Data Action' : 'Add Data Action'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Action Type</InputLabel>
              <Select
                value={dataActionConfig.type}
                onChange={(e) => setDataActionConfig({ ...dataActionConfig, type: e.target.value })}
                label="Action Type"
              >
                <MenuItem value="fetch">Fetch Data</MenuItem>
                <MenuItem value="create">Create Record</MenuItem>
                <MenuItem value="update">Update Record</MenuItem>
                <MenuItem value="delete">Delete Record</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>HTTP Method</InputLabel>
              <Select
                value={dataActionConfig.method}
                onChange={(e) => setDataActionConfig({ ...dataActionConfig, method: e.target.value })}
                label="HTTP Method"
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="API Endpoint"
              value={dataActionConfig.endpoint}
              onChange={(e) => setDataActionConfig({ ...dataActionConfig, endpoint: e.target.value })}
              placeholder="/api/users or http://localhost:8080/api/data"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><ApiIcon /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={dataActionConfig.autoExecute}
                  onChange={(e) => setDataActionConfig({ ...dataActionConfig, autoExecute: e.target.checked })}
                />
              }
              label="Auto Execute on Mount"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDataActionDialog(false)}>Cancel</Button>
        <Button 
          onClick={() => {
            const dataActions = selectedElement.dataActions || [];
            let updatedActions;
            
            if (selectedDataAction !== null) {
              updatedActions = dataActions.map((action, index) => 
                index === selectedDataAction ? { ...dataActionConfig, id: action.id || Date.now() } : action
              );
            } else {
              updatedActions = [...dataActions, { ...dataActionConfig, id: Date.now() }];
            }
            
            updateElementProperty('dataActions', updatedActions);
            setDataActionDialog(false);
            setSelectedDataAction(null);
          }} 
          variant="contained"
        >
          {selectedDataAction !== null ? 'Update' : 'Add'} Action
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Validation Dialog
  const renderValidationDialog = () => (
    <Dialog open={validationDialog} onClose={() => setValidationDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add Validation Rule</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Validation Type</InputLabel>
              <Select
                value={validationConfig.type}
                onChange={(e) => setValidationConfig({ ...validationConfig, type: e.target.value })}
                label="Validation Type"
              >
                <MenuItem value="required">Required</MenuItem>
                <MenuItem value="minLength">Minimum Length</MenuItem>
                <MenuItem value="maxLength">Maximum Length</MenuItem>
                <MenuItem value="pattern">Regex Pattern</MenuItem>
                <MenuItem value="email">Email Format</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Error Message"
              value={validationConfig.message}
              onChange={(e) => setValidationConfig({ ...validationConfig, message: e.target.value })}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setValidationDialog(false)}>Cancel</Button>
        <Button 
          onClick={() => {
            setValidationRules([...validationRules, { ...validationConfig, id: Date.now() }]);
            updateElementProperty('validationRules', [...validationRules, validationConfig]);
            setValidationDialog(false);
          }} 
          variant="contained"
        >
          Add Rule
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Conditional Dialog
  const renderConditionalDialog = () => (
    <Dialog open={conditionalDialog} onClose={() => setConditionalDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add Conditional Logic</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Condition Expression"
              value={conditionalConfig.condition}
              onChange={(e) => setConditionalConfig({ ...conditionalConfig, condition: e.target.value })}
              fullWidth
              size="small"
              placeholder="field.value === 'value'"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Action</InputLabel>
              <Select
                value={conditionalConfig.action}
                onChange={(e) => setConditionalConfig({ ...conditionalConfig, action: e.target.value })}
                label="Action"
              >
                <MenuItem value="show">Show</MenuItem>
                <MenuItem value="hide">Hide</MenuItem>
                <MenuItem value="enable">Enable</MenuItem>
                <MenuItem value="disable">Disable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Target</InputLabel>
              <Select
                value={conditionalConfig.target}
                onChange={(e) => setConditionalConfig({ ...conditionalConfig, target: e.target.value })}
                label="Target"
              >
                <MenuItem value="self">This Component</MenuItem>
                <MenuItem value="parent">Parent Component</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConditionalDialog(false)}>Cancel</Button>
        <Button 
          onClick={() => {
            setConditionalLogic([...conditionalLogic, { ...conditionalConfig, id: Date.now() }]);
            updateElementProperty('conditionalLogic', [...conditionalLogic, conditionalConfig]);
            setConditionalDialog(false);
          }} 
          variant="contained"
        >
          Add Logic
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Main component render
  if (!selectedElement) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Property Inspector
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a component to view and edit its properties
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxHeight: '100vh', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Property Inspector</Typography>
        <Chip
          label={type}
          size="small"
          color="primary"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Basic Properties */}
      <Accordion 
        expanded={expandedSections.basic} 
        onChange={() => handleSectionToggle('basic')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon fontSize="small" />
            <Typography variant="subtitle1">Basic Properties</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderBasicProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Style Properties */}
      <Accordion 
        expanded={expandedSections.style} 
        onChange={() => handleSectionToggle('style')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaletteIcon fontSize="small" />
            <Typography variant="subtitle1">Style Properties</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderStyleProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Layout Properties */}
      <Accordion 
        expanded={expandedSections.layout} 
        onChange={() => handleSectionToggle('layout')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewModuleIcon fontSize="small" />
            <Typography variant="subtitle1">Layout Properties</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderLayoutProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Advanced Properties */}
      <Accordion 
        expanded={expandedSections.advanced} 
        onChange={() => handleSectionToggle('advanced')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormatSizeIcon fontSize="small" />
            <Typography variant="subtitle1">Advanced Properties</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderAdvancedProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Event Properties */}
      <Accordion 
        expanded={expandedSections.events} 
        onChange={() => handleSectionToggle('events')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" />
            <Typography variant="subtitle1">Event Handlers</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderEventProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Data Actions */}
      <Accordion 
        expanded={expandedSections.dataActions} 
        onChange={() => handleSectionToggle('dataActions')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon fontSize="small" />
            <Typography variant="subtitle1">Data Actions</Typography>
            <Chip 
              label={selectedElement.dataActions?.length || 0} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderDataActions()}
        </AccordionDetails>
      </Accordion>

      {/* Validation Properties */}
      <Accordion 
        expanded={expandedSections.validation} 
        onChange={() => handleSectionToggle('validation')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="subtitle1">Validation Rules</Typography>
            <Chip 
              label={selectedElement.validationRules?.length || 0} 
              size="small" 
              color="success" 
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderValidationProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Conditional Logic */}
      <Accordion 
        expanded={expandedSections.conditional} 
        onChange={() => handleSectionToggle('conditional')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FunctionsIcon fontSize="small" />
            <Typography variant="subtitle1">Conditional Logic</Typography>
            <Chip 
              label={selectedElement.conditionalLogic?.length || 0} 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderConditionalProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Animation Properties */}
      <Accordion 
        expanded={expandedSections.animations} 
        onChange={() => handleSectionToggle('animations')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnimationIcon fontSize="small" />
            <Typography variant="subtitle1">Animation Settings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderAnimationProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Security Properties */}
      <Accordion 
        expanded={expandedSections.security} 
        onChange={() => handleSectionToggle('security')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon fontSize="small" />
            <Typography variant="subtitle1">Security Settings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {renderSecurityProperties()}
        </AccordionDetails>
      </Accordion>

      {/* Dialogs */}
      {renderDataActionDialog()}
      {renderValidationDialog()}
      {renderConditionalDialog()}
    </Box>
  );
};

export default PropertyInspector;
