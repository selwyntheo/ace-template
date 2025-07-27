import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Snackbar, 
  Alert, 
  Toolbar, 
  Typography, 
  IconButton,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  TextField,
  RadioGroup,
  Radio,
  Slider,
  Avatar,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Badge
} from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Rnd } from 'react-rnd';
import {
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  GridOn as GridIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  TextFields,
  SmartButton,
  Image,
  Input,
  CropFree,
  TableChart,
  ViewModule,
  ArrowDropDown,
  CheckBox,
  RadioButtonChecked,
  ToggleOn,
  LinearScale,
  TextFormat,
  DateRange,
  AccountCircle,
  Label,
  Notifications,
  Help,
  Remove,
  CropPortrait,
  ExpandMore,
  Tab,
  NavigateNext,
  Timeline,
  Autorenew,
  Warning,
  Info
} from '@mui/icons-material';
import { useCanvasStore } from '../stores/canvasStore';
import EnhancedTableComponent from './EnhancedTableComponent';
import PropertyInspector from './PropertyInspector';
import { useParams } from 'react-router-dom';

// Component library with proper drag/drop support
// Enhanced Component Library with Rich Features
const componentLibrary = [
  {
    type: 'text',
    label: 'Text',
    icon: <TextFields />,
    category: 'Content',
    defaultProps: {
      width: 200,
      height: 70,
      properties: { 
        content: 'Sample Text',
        variant: 'body1',
        color: 'text.primary',
        align: 'left',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '1.5',
        letterSpacing: 'normal'
      },
      styles: {
        fontFamily: 'Roboto, sans-serif'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: <SmartButton />,
    category: 'Actions',
    defaultProps: {
      width: 120,
      height: 60,
      properties: { 
        label: 'Button',
        variant: 'contained',
        color: 'primary',
        size: 'medium',
        disabled: false,
        fullWidth: false,
        startIcon: '',
        endIcon: '',
        onClick: '',
        type: 'button'
      }
    }
  },
  {
    type: 'input',
    label: 'Text Input',
    icon: <Input />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 60,
      properties: { 
        placeholder: 'Enter text...',
        label: 'Input Label',
        type: 'text',
        required: false,
        disabled: false,
        readOnly: false,
        multiline: false,
        rows: 1,
        helperText: '',
        error: false,
        variant: 'outlined',
        size: 'medium',
        fullWidth: true
      }
    }
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: <ArrowDropDown />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 60,
      properties: {
        label: 'Select Option',
        placeholder: 'Choose an option...',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        multiple: false,
        required: false,
        disabled: false,
        helperText: '',
        variant: 'outlined',
        size: 'medium',
        fullWidth: true
      }
    }
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckBox />,
    category: 'Form Controls',
    defaultProps: {
      width: 150,
      height: 50,
      properties: {
        label: 'Checkbox Label',
        checked: false,
        disabled: false,
        required: false,
        indeterminate: false,
        color: 'primary',
        size: 'medium',
        labelPlacement: 'end'
      }
    }
  },
  {
    type: 'radio',
    label: 'Radio Group',
    icon: <RadioButtonChecked />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 100,
      properties: {
        label: 'Radio Group',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ],
        value: '',
        disabled: false,
        required: false,
        row: false,
        color: 'primary',
        size: 'medium'
      }
    }
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: <ToggleOn />,
    category: 'Form Controls',
    defaultProps: {
      width: 120,
      height: 50,
      properties: {
        label: 'Switch Label',
        checked: false,
        disabled: false,
        required: false,
        color: 'primary',
        size: 'medium',
        labelPlacement: 'end'
      }
    }
  },
  {
    type: 'slider',
    label: 'Slider',
    icon: <LinearScale />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 60,
      properties: {
        label: 'Slider',
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        marks: false,
        valueLabelDisplay: 'auto',
        color: 'primary',
        orientation: 'horizontal'
      }
    }
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: <TextFormat />,
    category: 'Form Controls',
    defaultProps: {
      width: 300,
      height: 120,
      properties: {
        placeholder: 'Enter text...',
        label: 'Text Area',
        rows: 4,
        maxRows: 8,
        disabled: false,
        required: false,
        variant: 'outlined',
        fullWidth: true,
        helperText: ''
      }
    }
  },
  {
    type: 'datepicker',
    label: 'Date Picker',
    icon: <DateRange />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 60,
      properties: {
        label: 'Select Date',
        disabled: false,
        required: false,
        format: 'MM/dd/yyyy',
        variant: 'outlined',
        size: 'medium',
        helperText: ''
      }
    }
  },
  {
    type: 'avatar',
    label: 'Avatar',
    icon: <AccountCircle />,
    category: 'Display',
    defaultProps: {
      width: 60,
      height: 60,
      properties: {
        src: '',
        alt: 'Avatar',
        variant: 'circular',
        size: 'medium',
        fallback: 'U',
        color: 'default'
      }
    }
  },
  {
    type: 'chip',
    label: 'Chip',
    icon: <Label />,
    category: 'Display',
    defaultProps: {
      width: 100,
      height: 40,
      properties: {
        label: 'Chip',
        variant: 'filled',
        color: 'default',
        size: 'medium',
        deletable: false,
        clickable: false,
        icon: '',
        avatar: ''
      }
    }
  },
  {
    type: 'badge',
    label: 'Badge',
    icon: <Notifications />,
    category: 'Display',
    defaultProps: {
      width: 60,
      height: 40,
      properties: {
        badgeContent: '4',
        color: 'error',
        variant: 'standard',
        showZero: false,
        max: 99,
        invisible: false,
        overlap: 'rectangular',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      }
    }
  },
  {
    type: 'card',
    label: 'Card',
    icon: <CropPortrait />,
    category: 'Layout',
    defaultProps: {
      width: 300,
      height: 200,
      properties: {
        title: 'Card Title',
        subtitle: 'Card Subtitle',
        content: 'Card content goes here...',
        elevation: 2,
        variant: 'elevation'
      }
    }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: <Remove />,
    category: 'Layout',
    defaultProps: {
      width: 200,
      height: 20,
      properties: {
        orientation: 'horizontal',
        variant: 'fullWidth',
        textAlign: 'center',
        flexItem: false
      }
    }
  },
  {
    type: 'alert',
    label: 'Alert',
    icon: <Warning />,
    category: 'Feedback',
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        severity: 'info',
        variant: 'standard',
        message: 'This is an alert message',
        action: false,
        closable: false
      }
    }
  },
  {
    type: 'image',
    label: 'Image', 
    icon: <Image />,
    category: 'Content',
    defaultProps: {
      width: 150,
      height: 100,
      properties: { alt: 'Image' }
    }
  },
  {
    type: 'container',
    label: 'Container',
    icon: <CropFree />,
    category: 'Layout',
    defaultProps: {
      width: 200,
      height: 150,
      properties: {}
    }
  },
  {
    type: 'Table',
    label: 'Data Table',
    icon: <TableChart />,
    category: 'Data Management',
    defaultProps: {
      width: 400,
      height: 300,
      properties: { 
        dataSource: 'designs',
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        enableEditing: false,
        pageSize: 10
      }
    }
  }
];

// Canvas Element Component with working drag/resize
const CanvasElement = ({ element, isSelected, onUpdate, onDelete, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { id, type, x, y, width, height, properties = {}, styles = {}, visibility = true, locked = false } = element;

  // Render component content based on type
  const renderContent = () => {
    const commonStyles = {
      width: '100%',
      height: '100%',
      pointerEvents: locked ? 'none' : 'auto',
      opacity: visibility ? 1 : 0.5,
      userSelect: 'none', // Prevent text selection during drag
      ...styles,
    };

    switch (type) {
      case 'text':
        return isEditing ? (
          <TextField
            value={properties.content || 'Sample Text'}
            onChange={(e) => onUpdate({ properties: { ...properties, content: e.target.value } })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            variant="standard"
            autoFocus
            fullWidth
            multiline
            sx={{ 
              ...commonStyles,
              padding: '8px',
              '& .MuiInput-root': { fontSize: 'inherit' } 
            }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              ...commonStyles,
              padding: '8px',
              overflow: 'hidden',
              cursor: locked ? 'not-allowed' : 'text',
            }}
            onDoubleClick={() => !locked && setIsEditing(true)}
          >
            {properties.content || 'Sample Text'}
          </Typography>
        );

      case 'button':
        return (
          <Button
            variant="contained"
            sx={{
              ...commonStyles,
              fontSize: '14px',
            }}
            disabled={locked}
          >
            {properties.label || 'Button'}
          </Button>
        );

      case 'input':
        return (
          <TextField
            value={properties.value || ''}
            placeholder={properties.placeholder || 'Enter text...'}
            disabled={locked}
            fullWidth
            sx={{
              ...commonStyles,
            }}
            onChange={(e) => onUpdate({ properties: { ...properties, value: e.target.value } })}
          />
        );

      case 'dropdown':
        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel>{properties.label}</InputLabel>
            <Select
              value={properties.value || ''}
              label={properties.label}
              disabled={locked}
              onChange={(e) => onUpdate({ properties: { ...properties, value: e.target.value } })}
            >
              {(properties.options || []).map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <CheckBox
                checked={properties.checked || false}
                disabled={locked}
                onChange={(e) => onUpdate({ properties: { ...properties, checked: e.target.checked } })}
              />
            }
            label={properties.label || 'Checkbox'}
            sx={commonStyles}
          />
        );

      case 'radio':
        return (
          <FormControl sx={commonStyles}>
            <Typography variant="body2" sx={{ mb: 1 }}>{properties.label}</Typography>
            <RadioGroup
              value={properties.value || ''}
              onChange={(e) => onUpdate({ properties: { ...properties, value: e.target.value } })}
              row={properties.row}
            >
              {(properties.options || []).map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  disabled={locked}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={properties.checked || false}
                disabled={locked}
                onChange={(e) => onUpdate({ properties: { ...properties, checked: e.target.checked } })}
              />
            }
            label={properties.label || 'Switch'}
            sx={commonStyles}
          />
        );

      case 'slider':
        return (
          <Box sx={commonStyles}>
            <Typography variant="body2" sx={{ mb: 1 }}>{properties.label}</Typography>
            <Slider
              value={properties.value || 50}
              min={properties.min || 0}
              max={properties.max || 100}
              step={properties.step || 1}
              disabled={locked}
              onChange={(e, value) => onUpdate({ properties: { ...properties, value } })}
              valueLabelDisplay="auto"
            />
          </Box>
        );

      case 'textarea':
        return (
          <TextField
            value={properties.value || ''}
            placeholder={properties.placeholder || 'Enter text...'}
            label={properties.label}
            disabled={locked}
            fullWidth
            multiline
            rows={properties.rows || 4}
            maxRows={properties.maxRows || 8}
            sx={commonStyles}
            onChange={(e) => onUpdate({ properties: { ...properties, value: e.target.value } })}
          />
        );

      case 'avatar':
        return (
          <Avatar
            src={properties.src}
            alt={properties.alt}
            sx={{
              ...commonStyles,
              width: '100%',
              height: '100%',
            }}
          >
            {properties.fallback || 'U'}
          </Avatar>
        );

      case 'chip':
        return (
          <Chip
            label={properties.label || 'Chip'}
            variant={properties.variant || 'filled'}
            color={properties.color || 'default'}
            size={properties.size || 'medium'}
            disabled={locked}
            onDelete={properties.deletable ? () => {} : undefined}
            sx={commonStyles}
          />
        );

      case 'card':
        return (
          <Card sx={commonStyles} elevation={properties.elevation || 2}>
            <CardHeader title={properties.title} subheader={properties.subtitle} />
            <CardContent>
              <Typography variant="body2">{properties.content}</Typography>
            </CardContent>
          </Card>
        );

      case 'divider':
        return (
          <Divider
            orientation={properties.orientation || 'horizontal'}
            variant={properties.variant || 'fullWidth'}
            textAlign={properties.textAlign || 'center'}
            sx={commonStyles}
          />
        );

      case 'alert':
        return (
          <Alert
            severity={properties.severity || 'info'}
            variant={properties.variant || 'standard'}
            sx={commonStyles}
          >
            {properties.message || 'Alert message'}
          </Alert>
        );

      case 'image':
        return (
          <Box
            sx={{
              ...commonStyles,
              backgroundImage: properties.src ? `url(${properties.src})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!properties.src && (
              <Typography variant="body2" color="text.secondary">
                {properties.alt || 'Image'}
              </Typography>
            )}
          </Box>
        );

      case 'container':
        return (
          <Paper
            sx={{
              ...commonStyles,
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Container
            </Typography>
          </Paper>
        );

      case 'Table':
        return (
          <EnhancedTableComponent
            component={element}
            onComponentUpdate={onUpdate}
            styles={commonStyles}
          />
        );

      default:
        return (
          <Box
            sx={{
              ...commonStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
            }}
          >
            <Typography variant="body2">
              {type || 'Unknown'}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Rnd
      position={{ x, y }}
      size={{ width, height }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        onUpdate({ x: d.x, y: d.y });
      }}
      onDrag={() => setIsDragging(true)}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        onUpdate({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      onResize={() => setIsResizing(true)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disableDragging={locked}
      enableResizing={!locked}
      dragHandleClassName="drag-handle"
      bounds="parent"
      style={{
        border: isSelected ? '2px solid #1976d2' : '1px solid transparent',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 1000 : isDragging || isResizing ? 999 : 1,
        userSelect: 'none',
      }}
      resizeHandleStyles={{
        bottomRight: {
          bottom: '-5px',
          right: '-5px',
          width: '10px',
          height: '10px',
          background: '#1976d2',
          border: '1px solid white',
          borderRadius: '50%',
          display: isSelected ? 'block' : 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Drag Handle - Invisible overlay that allows dragging */}
        {!locked && (
          <Box
            className="drag-handle"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20px',
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: isSelected || isHovered ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
              borderBottom: isSelected || isHovered ? '1px dashed rgba(25, 118, 210, 0.3)' : 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {(isSelected || isHovered) && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '10px',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Drag Here
              </Typography>
            )}
          </Box>
        )}
        
        {/* Content area with reduced pointer events during drag */}
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            paddingTop: !locked ? '20px' : 0,
            pointerEvents: isDragging ? 'none' : 'auto',
          }}
        >
          {renderContent()}
        </Box>
        
        {/* Element Controls */}
        {(isSelected || isHovered) && !isDragging && !isResizing && (
          <Box
            sx={{
              position: 'absolute',
              top: -36,
              right: 0,
              display: 'flex',
              gap: 0.5,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '4px',
              padding: '2px',
              zIndex: 1001,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ visibility: !visibility });
              }}
              sx={{ color: 'white', p: 0.5 }}
              title={visibility ? 'Hide' : 'Show'}
            >
              {visibility ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ locked: !locked });
              }}
              sx={{ color: 'white', p: 0.5 }}
              title={locked ? 'Unlock' : 'Lock'}
            >
              {locked ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              sx={{ color: 'white', p: 0.5 }}
              title="Delete"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Element Info */}
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -20,
              left: 0,
              fontSize: '10px',
              color: '#1976d2',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 4px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              zIndex: 1001,
            }}
          >
            {type} ({Math.round(width)}×{Math.round(height)})
          </Box>
        )}
      </Box>
    </Rnd>
  );
};

// Main Canvas Editor Component
const CanvasEditor = () => {
  const { projectId } = useParams();
  const {
    elements,
    selectedElementId,
    canvasSettings,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    selectElement,
    updateCanvasSettings,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo,
  } = useCanvasStore();

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const canvasRef = useRef(null);

  // Generate unique ID for new elements
  const generateId = useCallback(() => {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add component to canvas
  const addComponent = useCallback((componentType) => {
    const component = componentLibrary.find(c => c.type === componentType);
    if (!component) return;

    const newElement = {
      id: generateId(),
      type: componentType,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      ...component.defaultProps,
      visibility: true,
      locked: false,
    };

    addElement(newElement);
    selectElement(newElement.id);

    setNotification({
      open: true,
      message: `Added ${component.label} component`,
      severity: 'success',
    });
  }, [addElement, selectElement, generateId]);

  // Handle element updates
  const handleElementUpdate = useCallback((elementId, updates) => {
    updateElement(elementId, updates);
  }, [updateElement]);

  // Handle element deletion
  const handleElementDelete = useCallback((elementId) => {
    removeElement(elementId);
    setNotification({
      open: true,
      message: 'Element deleted',
      severity: 'info',
    });
  }, [removeElement]);

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  }, [selectElement]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            // Save functionality would go here
            setNotification({
              open: true,
              message: 'Project saved',
              severity: 'success',
            });
            break;
          default:
            break;
        }
      }
      
      if (e.key === 'Delete' && selectedElementId) {
        handleElementDelete(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedElementId, handleElementDelete]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Editor Toolbar */}
        <Paper 
          elevation={1} 
          sx={{ 
            width: '100%', 
            borderRadius: 0,
            flexShrink: 0
          }}
        >
          <Toolbar variant="dense" sx={{ minHeight: '48px', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Canvas Editor {projectId && `- Project ${projectId}`}
            </Typography>
            
            <Tooltip title="Undo">
              <span>
                <IconButton color="inherit" onClick={undo} disabled={!canUndo} size="small">
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Redo">
              <span>
                <IconButton color="inherit" onClick={redo} disabled={!canRedo} size="small">
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            
            <Tooltip title="Zoom Out">
              <IconButton 
                color="inherit" 
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                disabled={zoom <= 25}
                size="small"
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Typography variant="body2" sx={{ mx: 1 }}>
              {zoom}%
            </Typography>
            
            <Tooltip title="Zoom In">
              <IconButton 
                color="inherit" 
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                disabled={zoom >= 200}
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            
            <FormControlLabel
              control={
                <Switch
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  size="small"
                />
              }
              label="Grid"
              sx={{ color: 'white', mr: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={previewMode}
                  onChange={(e) => setPreviewMode(e.target.checked)}
                  size="small"
                />
              }
              label="Preview"
              sx={{ color: 'white', mr: 2 }}
            />
            
            <Button color="inherit" startIcon={<SaveIcon />} size="small">
              Save
            </Button>
          </Toolbar>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', width: '100%', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left Sidebar - Component Library */}
          <Drawer
            variant="persistent"
            anchor="left"
            open={sidebarOpen}
            sx={{
              width: sidebarOpen ? 280 : 0,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 280,
                boxSizing: 'border-box',
                position: 'relative',
                height: '100%',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Components
              </Typography>
              
              {/* Group components by category */}
              {['Content', 'Form Controls', 'Display', 'Layout', 'Navigation', 'Feedback', 'Data Management'].map((category) => {
                const categoryComponents = componentLibrary.filter(comp => comp.category === category);
                if (categoryComponents.length === 0) return null;
                
                return (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'text.secondary', 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        mb: 1 
                      }}
                    >
                      {category}
                    </Typography>
                    <Grid container spacing={1}>
                      {categoryComponents.map((component) => (
                        <Grid item xs={6} key={component.type}>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => addComponent(component.type)}
                            sx={{
                              height: '60px',
                              flexDirection: 'column',
                              gap: 0.5,
                              fontSize: '11px',
                              border: '1px solid #e0e0e0',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            {component.icon}
                            {component.label}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Canvas Settings
              </Typography>
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Canvas Size</InputLabel>
                <Select
                  value={`${canvasSettings.width}x${canvasSettings.height}`}
                  label="Canvas Size"
                  onChange={(e) => {
                    const [width, height] = e.target.value.split('x').map(Number);
                    updateCanvasSettings({ width, height });
                  }}
                >
                  <MenuItem value="800x600">800 × 600</MenuItem>
                  <MenuItem value="1024x768">1024 × 768</MenuItem>
                  <MenuItem value="1200x900">1200 × 900</MenuItem>
                  <MenuItem value="1440x1080">1440 × 1080</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (window.confirm('Clear all elements?')) {
                    clearCanvas();
                    setNotification({
                      open: true,
                      message: 'Canvas cleared',
                      severity: 'info',
                    });
                  }
                }}
              >
                Clear Canvas
              </Button>
            </Box>
          </Drawer>

          {/* Main Canvas Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              backgroundColor: '#f5f5f5',
              height: '100%',
            }}
          >
            <Box
              sx={{
                p: 2,
                minHeight: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              {/* Canvas */}
              <Box
                ref={canvasRef}
                onClick={handleCanvasClick}
                sx={{
                  position: 'relative',
                  width: canvasSettings.width,
                  height: canvasSettings.height,
                  backgroundColor: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  cursor: 'default',
                  overflow: 'hidden',
                  ...(showGrid && {
                    backgroundImage: `
                      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }),
                }}
              >
                {elements.map((element) => (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                    onDelete={handleElementDelete}
                    onSelect={selectElement}
                  />
                ))}

                {/* Empty State */}
                {elements.length === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <ViewModule sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Start Building
                    </Typography>
                    <Typography variant="body2">
                      Add components from the sidebar to get started
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar - Property Inspector */}
          <Box
            sx={{
              width: 320,
              flexShrink: 0,
              backgroundColor: 'white',
              borderLeft: '1px solid #e0e0e0',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <PropertyInspector
              selectedElement={selectedElementId ? elements.find(el => el.id === selectedElementId) : null}
              onPropertyUpdate={(updates) => selectedElementId && handleElementUpdate(selectedElementId, updates)}
              elements={elements}
            />
          </Box>
        </Box>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={notification.severity} 
            variant="filled"
            onClose={() => setNotification({ ...notification, open: false })}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

export default CanvasEditor;
