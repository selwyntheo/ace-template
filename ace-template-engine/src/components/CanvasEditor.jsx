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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Fab,
  Backdrop,
  CircularProgress,
  AppBar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  Info,
  Publish,
  History,
  Download,
  Upload,
  Share,
  FileCopy,
  CloudUpload,
  Close,
  PlayArrow,
  Stop
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

      case 'datepicker':
        return (
          <DatePicker
            label={properties.label || 'Select Date'}
            value={properties.value ? new Date(properties.value) : null}
            onChange={(newValue) => onUpdate({ 
              properties: { 
                ...properties, 
                value: newValue ? newValue.toISOString() : null 
              } 
            })}
            disabled={locked}
            format={properties.format || 'MM/dd/yyyy'}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: properties.variant || 'outlined',
                size: properties.size || 'medium',
                helperText: properties.helperText || '',
                required: properties.required || false,
                sx: commonStyles,
                error: properties.error || false
              }
            }}
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
        border: isSelected ? '2px solid #2B9CAE' : '1px solid transparent',
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
          background: '#2B9CAE',
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
              backgroundColor: isSelected || isHovered ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              borderBottom: isSelected || isHovered ? '1px dashed rgba(107, 115, 255, 0.3)' : 'none',
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
                  color: '#2B9CAE',
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
              color: '#2B9CAE',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '2px 6px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              zIndex: 1001,
              border: '1px solid rgba(107, 115, 255, 0.2)',
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

  // Enhanced state for save/naming/version functionality
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState(projectId ? `Project ${projectId}` : 'Untitled Design');
  const [projectDescription, setProjectDescription] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [versionNotes, setVersionNotes] = useState('');
  const [projectMetadata, setProjectMetadata] = useState({
    author: 'Current User',
    tags: [],
    category: 'Web Design',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

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

  // Enhanced save functionality
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const designData = {
        id: projectId || `design_${Date.now()}`,
        name: projectName,
        description: projectDescription,
        version,
        elements,
        canvasSettings,
        metadata: {
          ...projectMetadata,
          updatedAt: new Date().toISOString(),
          elementCount: elements.length
        }
      };

      // Simulate API call to save design
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to your backend
      console.log('Saving design:', designData);
      localStorage.setItem(`design_${designData.id}`, JSON.stringify(designData));

      setNotification({
        open: true,
        message: `Design "${projectName}" saved successfully!`,
        severity: 'success',
      });
      setSaveDialogOpen(false);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to save design. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [projectId, projectName, projectDescription, version, elements, canvasSettings, projectMetadata]);

  // Version management
  const handleCreateVersion = useCallback(async () => {
    setSaving(true);
    try {
      const versionData = {
        version,
        notes: versionNotes,
        timestamp: new Date().toISOString(),
        elements: elements.length,
        snapshot: elements
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating version:', versionData);
      
      setNotification({
        open: true,
        message: `Version ${version} created successfully!`,
        severity: 'success',
      });
      setVersionDialogOpen(false);
      setVersionNotes('');
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to create version. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [version, versionNotes, elements]);

  // Preview functionality
  const handlePreview = useCallback(() => {
    setPreviewDialogOpen(true);
  }, []);

  // Export functionality
  const handleExport = useCallback(async (format) => {
    setSaving(true);
    try {
      const exportData = {
        format,
        name: projectName,
        elements,
        canvasSettings,
        timestamp: new Date().toISOString()
      };

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `${projectName.replace(/\s+/g, '_')}_design.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }

      setNotification({
        open: true,
        message: `Design exported as ${format.toUpperCase()} successfully!`,
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Export failed. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [projectName, elements, canvasSettings]);

  // Publish functionality
  const handlePublish = useCallback(async () => {
    setSaving(true);
    try {
      const publishData = {
        ...projectMetadata,
        name: projectName,
        description: projectDescription,
        version,
        elements,
        canvasSettings,
        publishedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Publishing design:', publishData);
      
      setNotification({
        open: true,
        message: `Design "${projectName}" published successfully!`,
        severity: 'success',
      });
      setPublishDialogOpen(false);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to publish design. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [projectName, projectDescription, version, elements, canvasSettings, projectMetadata]);

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
        {/* Enhanced Editor Toolbar with softer colors */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: '#F8FAFC', // Very light grey-blue
            color: '#2D3748', // Dark grey
            borderBottom: '1px solid #E2E8F0',
            borderRadius: 0,
            '& .MuiToolbar-root': {
              minHeight: '56px',
            }
          }}
        >
          <Toolbar variant="dense">
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mr: 3, fontWeight: 600, color: '#4A5568' }}>
                {projectName}
              </Typography>
              
              <Chip 
                label={`v${version}`} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(107, 115, 255, 0.1)', 
                  color: '#2B9CAE',
                  mr: 2,
                  fontWeight: 500,
                }} 
              />
              
              <Typography variant="caption" sx={{ color: '#718096' }}>
                {elements.length} element{elements.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Undo (Ctrl+Z)">
                <span>
                  <IconButton 
                    onClick={undo} 
                    disabled={!canUndo} 
                    size="small"
                    sx={{
                      color: !canUndo ? '#CBD5E0' : '#718096',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 115, 255, 0.08)',
                        color: '#2B9CAE',
                      },
                    }}
                  >
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip title="Redo (Ctrl+Y)">
                <span>
                  <IconButton 
                    onClick={redo} 
                    disabled={!canRedo} 
                    size="small"
                    sx={{
                      color: !canRedo ? '#CBD5E0' : '#718096',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 115, 255, 0.08)',
                        color: '#2B9CAE',
                      },
                    }}
                  >
                    <RedoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#E2E8F0' }} />
              
              <Tooltip title="Zoom Out">
                <IconButton 
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  disabled={zoom <= 25}
                  size="small"
                  sx={{
                    color: zoom <= 25 ? '#CBD5E0' : '#718096',
                    '&:hover': {
                      backgroundColor: 'rgba(107, 115, 255, 0.08)',
                      color: '#2B9CAE',
                    },
                  }}
                >
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              
              <Typography variant="body2" sx={{ mx: 1, minWidth: '45px', textAlign: 'center', color: '#4A5568' }}>
                {zoom}%
              </Typography>
              
              <Tooltip title="Zoom In">
                <IconButton 
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                  size="small"
                  sx={{
                    color: zoom >= 200 ? '#CBD5E0' : '#718096',
                    '&:hover': {
                      backgroundColor: 'rgba(107, 115, 255, 0.08)',
                      color: '#2B9CAE',
                    },
                  }}
                >
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#E2E8F0' }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2B9CAE',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(107, 115, 255, 0.5)',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#E2E8F0',
                      },
                    }}
                  />
                }
                label="Grid"
                sx={{ color: '#4A5568', mr: 2, ml: 1 }}
              />
              
              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#E2E8F0' }} />
              
              <Button 
                startIcon={<PreviewIcon />} 
                onClick={handlePreview}
                size="small"
                sx={{ 
                  mr: 1,
                  color: '#718096',
                  '&:hover': {
                    backgroundColor: 'rgba(107, 115, 255, 0.08)',
                    color: '#2B9CAE',
                  },
                }}
              >
                Preview
              </Button>
              
              <Button 
                startIcon={<History />} 
                onClick={() => setVersionDialogOpen(true)}
                size="small"
                sx={{ 
                  mr: 1,
                  color: '#718096',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 154, 162, 0.08)',
                    color: '#5A7A8F',
                  },
                }}
              >
                Version
              </Button>
              
              <Button 
                variant="contained"
                startIcon={<SaveIcon />} 
                onClick={() => setSaveDialogOpen(true)}
                size="small"
                sx={{ 
                  backgroundColor: '#2B9CAE',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1F6B7A',
                  },
                  '&:disabled': {
                    backgroundColor: '#CBD5E0',
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

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
                backgroundColor: '#FAFBFC',
                borderRight: '1px solid #E2E8F0',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
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
                        color: '#4A5568', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        mb: 1,
                        fontSize: '0.75rem',
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
                              border: '1px solid #E2E8F0',
                              color: '#4A5568',
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(107, 115, 255, 0.04)',
                                borderColor: '#2B9CAE',
                                color: '#2B9CAE',
                                '& .MuiSvgIcon-root': {
                                  color: '#2B9CAE',
                                },
                              },
                              '& .MuiSvgIcon-root': {
                                color: '#718096',
                                fontSize: '1.2rem',
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

              <Divider sx={{ my: 2, borderColor: '#E2E8F0' }} />

              <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
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
                sx={{
                  borderColor: '#FEB2B2',
                  color: '#E53E3E',
                  '&:hover': {
                    backgroundColor: 'rgba(229, 62, 62, 0.04)',
                    borderColor: '#E53E3E',
                  },
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
              backgroundColor: '#F7FAFC',
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
                  border: '2px solid #E2E8F0',
                  borderRadius: 2,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  cursor: 'default',
                  overflow: 'hidden',
                  ...(showGrid && {
                    backgroundImage: `
                      linear-gradient(to right, #EDF2F7 1px, transparent 1px),
                      linear-gradient(to bottom, #EDF2F7 1px, transparent 1px)
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
              backgroundColor: '#FAFBFC',
              borderLeft: '1px solid #E2E8F0',
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

        {/* Enhanced Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#2B9CAE', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Save Design</Typography>
              <IconButton onClick={() => setSaveDialogOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                variant="outlined"
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={projectMetadata.category}
                  label="Category"
                  onChange={(e) => setProjectMetadata(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="Web Design">Web Design</MenuItem>
                  <MenuItem value="Mobile App">Mobile App</MenuItem>
                  <MenuItem value="Dashboard">Dashboard</MenuItem>
                  <MenuItem value="Landing Page">Landing Page</MenuItem>
                  <MenuItem value="E-commerce">E-commerce</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={projectMetadata.isPublic}
                    onChange={(e) => setProjectMetadata(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                }
                label="Make Public"
              />
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Design Summary:</strong>
                </Typography>
                <Typography variant="body2">
                  • {elements.length} component{elements.length !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2">
                  • Canvas size: {canvasSettings.width} × {canvasSettings.height}
                </Typography>
                <Typography variant="body2">
                  • Last modified: {new Date().toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={saving || !projectName.trim()}
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              sx={{ bgcolor: '#2B9CAE', '&:hover': { bgcolor: '#1F6B7A' } }}
            >
              {saving ? 'Saving...' : 'Save Design'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Version Dialog */}
        <Dialog open={versionDialogOpen} onClose={() => setVersionDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#5A7A8F', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Create New Version</Typography>
              <IconButton onClick={() => setVersionDialogOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Version Number"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                variant="outlined"
                helperText="Use semantic versioning (e.g., 1.0.0, 1.1.0, 2.0.0)"
              />
              <TextField
                fullWidth
                label="Version Notes"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
                placeholder="Describe what changed in this version..."
              />
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Current State:</strong>
                </Typography>
                <Typography variant="body2">
                  • {elements.length} component{elements.length !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2">
                  • Canvas: {canvasSettings.width} × {canvasSettings.height}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setVersionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleCreateVersion}
              disabled={saving || !version.trim()}
              startIcon={saving ? <CircularProgress size={16} /> : <History />}
              sx={{ bgcolor: '#5A7A8F', '&:hover': { bgcolor: '#4A6B7E' } }}
            >
              {saving ? 'Creating...' : 'Create Version'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog 
          open={previewDialogOpen} 
          onClose={() => setPreviewDialogOpen(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{ sx: { height: '90vh' } }}
        >
          <DialogTitle sx={{ bgcolor: '#A78BFA', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Preview: {projectName}</Typography>
              <Box>
                <Button 
                  color="inherit" 
                  startIcon={<Download />}
                  onClick={() => handleExport('json')}
                  sx={{ mr: 1 }}
                >
                  Export
                </Button>
                <IconButton onClick={() => setPreviewDialogOpen(false)} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: canvasSettings.width,
                  height: canvasSettings.height,
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transform: 'scale(0.8)',
                  transformOrigin: 'center',
                }}
              >
                {elements.map((element) => (
                  <Box
                    key={element.id}
                    sx={{
                      position: 'absolute',
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      opacity: element.visibility ? 1 : 0.5,
                    }}
                  >
                    {/* Render preview of element without interaction */}
                    {element.type === 'text' && (
                      <Typography
                        variant="body1"
                        sx={{
                          width: '100%',
                          height: '100%',
                          padding: '8px',
                          overflow: 'hidden',
                          ...element.styles,
                        }}
                      >
                        {element.properties?.content || 'Sample Text'}
                      </Typography>
                    )}
                    {element.type === 'button' && (
                      <Button
                        variant="contained"
                        sx={{
                          width: '100%',
                          height: '100%',
                          fontSize: '14px',
                          ...element.styles,
                        }}
                      >
                        {element.properties?.label || 'Button'}
                      </Button>
                    )}
                    {/* Add more preview renderings for other element types */}
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Publish Dialog */}
        <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#FFA726', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Publish Design</Typography>
              <IconButton onClick={() => setPublishDialogOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stepper activeStep={0} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Prepare</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review</StepLabel>
              </Step>
              <Step>
                <StepLabel>Publish</StepLabel>
              </Step>
            </Stepper>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={projectMetadata.isPublic}
                      onChange={(e) => setProjectMetadata(prev => ({ ...prev, isPublic: e.target.checked }))}
                    />
                  }
                  label="Public Template"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow Comments"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Featured Design"
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="outlined" 
              startIcon={<Share />}
              sx={{ mr: 1 }}
            >
              Share Link
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePublish}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : <Publish />}
              sx={{ bgcolor: '#FFA726', '&:hover': { bgcolor: '#FB8C00' } }}
            >
              {saving ? 'Publishing...' : 'Publish Design'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Backdrop */}
        <Backdrop open={saving} sx={{ zIndex: 9999 }}>
          <CircularProgress sx={{ color: '#2B9CAE' }} />
        </Backdrop>

        {/* Floating Action Buttons for Quick Actions */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Quick Save" placement="left">
            <Fab
              size="small"
              onClick={handleSave}
              sx={{ 
                bgcolor: '#2B9CAE', 
                color: 'white',
                '&:hover': { bgcolor: '#1F6B7A' },
              }}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Publish" placement="left">
            <Fab
              size="small"
              onClick={() => setPublishDialogOpen(true)}
              sx={{ 
                bgcolor: '#FFA726', 
                color: 'white',
                '&:hover': { bgcolor: '#FB8C00' },
              }}
            >
              <CloudUpload />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default CanvasEditor;
