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
  AppBar,
  Checkbox
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
  Stop,
  Clear,
  Search as SearchIcon
} from '@mui/icons-material';
import { useCanvasStore } from '../stores/canvasStore';
import EnhancedTableComponent from './EnhancedTableComponent'; // Original component with infinite loop fixes
import PropertyInspector from './PropertyInspector'; // Original component with infinite loop fixes
import { useParams } from 'react-router-dom';

// Import new UI library components
import {
  Button as UIButton,
  ButtonSolid,
  ButtonOutline,
  ButtonText,
  IconButton as UIIconButton,
  Input as UIInput,
  PasswordInput,
  EmailInput,
  SearchInput,
  TextArea as UITextArea,
  Modal as UIModal,
  ConfirmModal,
  AlertModal,
  FormModal,
  Card as UICard,
  ActionCard,
  StatsCard,
  FeatureCard,
  RadioGroup as UIRadioGroup,
  Checkbox as UICheckbox,
  Switch as UISwitch,
  Toggle,
  FormField,
  Select as UISelect,
  MultiSelect,
  Combobox,
  NativeSelect,
  GroupedSelect,
  Drawer as UIDrawer,
  NavigationDrawer,
  SidebarLayout,
  Header as UIHeader,
  NavigationHeader,
  PageHeader,
  AppBar as UIAppBar,
  Accordion as UIAccordion,
  AccordionGroup,
  CollapsibleSection,
  SearchBox,
  AdvancedSearchBox,
  Pagination as UIPagination,
  AdvancedPagination,
  Alert as UIAlert,
  Toast,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  Spinner,
  ProgressBar,
  LoadingOverlay,
  Tooltip as UITooltip,
  FloatingActionButton,
  Badge as UIBadge,
  Avatar as UIAvatar,
  Menu as UIMenu,
  DropdownMenu,
  ActionMenu
} from './UI';

// Enhanced Component Library with new UI components
const componentLibrary = [
  // ===== BUTTON COMPONENTS =====
  {
    type: 'ui-button',
    label: 'UI Button',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 120,
      height: 40,
      properties: { 
        children: 'Button',
        variant: 'contained',
        color: 'primary',
        size: 'medium',
        disabled: false,
        fullWidth: false
      }
    }
  },
  {
    type: 'ui-button-solid',
    label: 'Solid Button',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 120,
      height: 40,
      properties: { 
        children: 'Solid Button',
        color: 'primary',
        size: 'medium'
      }
    }
  },
  {
    type: 'ui-button-outline',
    label: 'Outline Button',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 120,
      height: 40,
      properties: { 
        children: 'Outline Button',
        color: 'primary',
        size: 'medium'
      }
    }
  },
  {
    type: 'ui-button-text',
    label: 'Text Button',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 120,
      height: 40,
      properties: { 
        children: 'Text Button',
        color: 'primary',
        size: 'medium'
      }
    }
  },
  {
    type: 'ui-icon-button',
    label: 'Icon Button',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 48,
      height: 48,
      properties: { 
        icon: 'SettingsIcon',
        color: 'primary',
        size: 'medium'
      }
    }
  },
  {
    type: 'ui-floating-action-button',
    label: 'FAB',
    icon: <SmartButton />,
    category: 'Buttons & Actions',
    defaultProps: {
      width: 56,
      height: 56,
      properties: { 
        icon: 'AddIcon',
        color: 'primary',
        size: 'medium'
      }
    }
  },

  // ===== INPUT COMPONENTS =====
  {
    type: 'ui-input',
    label: 'UI Input',
    icon: <Input />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: { 
        placeholder: 'Enter text...',
        label: 'Input Label',
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-password-input',
    label: 'Password Input',
    icon: <Input />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: { 
        placeholder: 'Enter password...',
        label: 'Password',
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-email-input',
    label: 'Email Input',
    icon: <Input />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: { 
        placeholder: 'Enter email...',
        label: 'Email',
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-search-input',
    label: 'Search Input',
    icon: <Input />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: { 
        placeholder: 'Search...',
        label: 'Search',
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-textarea',
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
        variant: 'outlined',
        fullWidth: true
      }
    }
  },

  // ===== SELECT COMPONENTS =====
  {
    type: 'ui-select',
    label: 'UI Select',
    icon: <ArrowDropDown />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: {
        label: 'Select Option',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-multi-select',
    label: 'Multi Select',
    icon: <ArrowDropDown />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: {
        label: 'Select Multiple',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-combobox',
    label: 'Combobox',
    icon: <ArrowDropDown />,
    category: 'Form Controls',
    defaultProps: {
      width: 200,
      height: 56,
      properties: {
        label: 'Combobox',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ],
        variant: 'outlined',
        fullWidth: true
      }
    }
  },

  // ===== FORM CONTROL COMPONENTS =====
  {
    type: 'ui-radio-group',
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
        value: 'option1'
      }
    }
  },
  {
    type: 'ui-checkbox',
    label: 'UI Checkbox',
    icon: <CheckBox />,
    category: 'Form Controls',
    defaultProps: {
      width: 150,
      height: 42,
      properties: {
        label: 'Checkbox Label',
        checked: false,
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-switch',
    label: 'UI Switch',
    icon: <ToggleOn />,
    category: 'Form Controls',
    defaultProps: {
      width: 120,
      height: 42,
      properties: {
        label: 'Switch Label',
        checked: false,
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-toggle',
    label: 'Toggle',
    icon: <ToggleOn />,
    category: 'Form Controls',
    defaultProps: {
      width: 120,
      height: 42,
      properties: {
        label: 'Toggle Label',
        checked: false,
        color: 'primary'
      }
    }
  },

  // ===== MODAL COMPONENTS =====
  {
    type: 'ui-modal',
    label: 'UI Modal',
    icon: <CropPortrait />,
    category: 'Modals & Dialogs',
    defaultProps: {
      width: 400,
      height: 300,
      properties: {
        title: 'Modal Title',
        content: 'Modal content goes here...',
        open: false,
        showCloseButton: true
      }
    }
  },
  {
    type: 'ui-confirm-modal',
    label: 'Confirm Modal',
    icon: <CropPortrait />,
    category: 'Modals & Dialogs',
    defaultProps: {
      width: 400,
      height: 200,
      properties: {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        open: false,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      }
    }
  },
  {
    type: 'ui-alert-modal',
    label: 'Alert Modal',
    icon: <CropPortrait />,
    category: 'Modals & Dialogs',
    defaultProps: {
      width: 400,
      height: 200,
      properties: {
        title: 'Alert',
        message: 'This is an alert message.',
        open: false,
        severity: 'warning'
      }
    }
  },
  {
    type: 'ui-form-modal',
    label: 'Form Modal',
    icon: <CropPortrait />,
    category: 'Modals & Dialogs',
    defaultProps: {
      width: 500,
      height: 400,
      properties: {
        title: 'Form Modal',
        fields: [
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' }
        ],
        open: false
      }
    }
  },

  // ===== CARD COMPONENTS =====
  {
    type: 'ui-card',
    label: 'UI Card',
    icon: <CropPortrait />,
    category: 'Cards & Display',
    defaultProps: {
      width: 300,
      height: 200,
      properties: {
        title: 'Card Title',
        content: 'Card content goes here...',
        elevation: 1,
        variant: 'elevation'
      }
    }
  },
  {
    type: 'ui-action-card',
    label: 'Action Card',
    icon: <CropPortrait />,
    category: 'Cards & Display',
    defaultProps: {
      width: 300,
      height: 250,
      properties: {
        title: 'Action Card',
        content: 'Card with action buttons',
        primaryAction: 'Primary',
        secondaryAction: 'Secondary'
      }
    }
  },
  {
    type: 'ui-stats-card',
    label: 'Stats Card',
    icon: <CropPortrait />,
    category: 'Cards & Display',
    defaultProps: {
      width: 280,
      height: 150,
      properties: {
        title: 'Total Users',
        value: '1,234',
        trend: '+12%',
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-feature-card',
    label: 'Feature Card',
    icon: <CropPortrait />,
    category: 'Cards & Display',
    defaultProps: {
      width: 320,
      height: 200,
      properties: {
        title: 'Feature Title',
        description: 'Feature description goes here...',
        icon: 'Star',
        color: 'primary'
      }
    }
  },

  // ===== NAVIGATION COMPONENTS =====
  {
    type: 'ui-search-box',
    label: 'Search Box',
    icon: <Input />,
    category: 'Navigation',
    defaultProps: {
      width: 300,
      height: 56,
      properties: {
        placeholder: 'Search...',
        variant: 'outlined',
        fullWidth: true
      }
    }
  },
  {
    type: 'ui-advanced-search-box',
    label: 'Advanced Search',
    icon: <Input />,
    category: 'Navigation',
    defaultProps: {
      width: 400,
      height: 56,
      properties: {
        placeholder: 'Advanced search...',
        variant: 'outlined',
        showFilters: true
      }
    }
  },
  {
    type: 'ui-pagination',
    label: 'Pagination',
    icon: <NavigateNext />,
    category: 'Navigation',
    defaultProps: {
      width: 300,
      height: 50,
      properties: {
        count: 10,
        page: 1,
        variant: 'outlined',
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-advanced-pagination',
    label: 'Advanced Pagination',
    icon: <NavigateNext />,
    category: 'Navigation',
    defaultProps: {
      width: 400,
      height: 50,
      properties: {
        count: 10,
        page: 1,
        showFirstButton: true,
        showLastButton: true,
        siblingCount: 1
      }
    }
  },

  // ===== FEEDBACK COMPONENTS =====
  {
    type: 'ui-alert',
    label: 'UI Alert',
    icon: <Warning />,
    category: 'Feedback',
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        message: 'This is an alert message',
        severity: 'info',
        variant: 'filled',
        closable: true
      }
    }
  },
  {
    type: 'ui-success-alert',
    label: 'Success Alert',
    icon: <Warning />,
    category: 'Feedback',
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        message: 'Success! Operation completed.',
        severity: 'success',
        variant: 'filled'
      }
    }
  },
  {
    type: 'ui-error-alert',
    label: 'Error Alert',
    icon: <Warning />,
    category: 'Feedback',
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        message: 'Error! Something went wrong.',
        severity: 'error',
        variant: 'filled'
      }
    }
  },
  {
    type: 'ui-warning-alert',
    label: 'Warning Alert',
    icon: <Warning />,
    category: 'Feedback',
    defaultProps: {
      width: 300,
      height: 60,
      properties: {
        message: 'Warning! Please check your input.',
        severity: 'warning',
        variant: 'filled'
      }
    }
  },
  {
    type: 'ui-toast',
    label: 'Toast',
    icon: <Info />,
    category: 'Feedback',
    defaultProps: {
      width: 350,
      height: 60,
      properties: {
        message: 'Toast notification',
        position: 'top-right',
        duration: 4000,
        type: 'info'
      }
    }
  },

  // ===== LOADING COMPONENTS =====
  {
    type: 'ui-spinner',
    label: 'Spinner',
    icon: <Autorenew />,
    category: 'Loading',
    defaultProps: {
      width: 40,
      height: 40,
      properties: {
        size: 'medium',
        color: 'primary',
        variant: 'indeterminate'
      }
    }
  },
  {
    type: 'ui-progress-bar',
    label: 'Progress Bar',
    icon: <Timeline />,
    category: 'Loading',
    defaultProps: {
      width: 300,
      height: 8,
      properties: {
        value: 50,
        variant: 'determinate',
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-loading-overlay',
    label: 'Loading Overlay',
    icon: <Autorenew />,
    category: 'Loading',
    defaultProps: {
      width: 200,
      height: 200,
      properties: {
        loading: true,
        message: 'Loading...',
        color: 'primary'
      }
    }
  },

  // ===== LAYOUT COMPONENTS =====
  {
    type: 'ui-drawer',
    label: 'UI Drawer',
    icon: <ViewModule />,
    category: 'Layout',
    defaultProps: {
      width: 280,
      height: 400,
      properties: {
        open: true,
        anchor: 'left',
        variant: 'temporary',
        content: 'Drawer content'
      }
    }
  },
  {
    type: 'ui-header',
    label: 'UI Header',
    icon: <ViewModule />,
    category: 'Layout',
    defaultProps: {
      width: 600,
      height: 64,
      properties: {
        title: 'Header Title',
        variant: 'elevated',
        color: 'primary'
      }
    }
  },
  {
    type: 'ui-sidebar-layout',
    label: 'Sidebar Layout',
    icon: <ViewModule />,
    category: 'Layout',
    defaultProps: {
      width: 800,
      height: 600,
      properties: {
        sidebarWidth: 240,
        sidebarOpen: true,
        sidebarContent: 'Sidebar content',
        mainContent: 'Main content'
      }
    }
  },
  {
    type: 'ui-accordion',
    label: 'UI Accordion',
    icon: <ExpandMore />,
    category: 'Layout',
    defaultProps: {
      width: 400,
      height: 200,
      properties: {
        sections: [
          { title: 'Section 1', content: 'Content 1' },
          { title: 'Section 2', content: 'Content 2' }
        ],
        defaultExpanded: false
      }
    }
  },

  // ===== UTILITY COMPONENTS =====
  {
    type: 'ui-tooltip',
    label: 'UI Tooltip',
    icon: <Help />,
    category: 'Utilities',
    defaultProps: {
      width: 100,
      height: 40,
      properties: {
        title: 'Tooltip text',
        placement: 'top',
        arrow: true,
        children: 'Hover me'
      }
    }
  },
  {
    type: 'ui-badge',
    label: 'UI Badge',
    icon: <Notifications />,
    category: 'Utilities',
    defaultProps: {
      width: 60,
      height: 40,
      properties: {
        badgeContent: 4,
        color: 'error',
        variant: 'standard',
        children: 'Badge'
      }
    }
  },
  {
    type: 'ui-avatar',
    label: 'UI Avatar',
    icon: <AccountCircle />,
    category: 'Utilities',
    defaultProps: {
      width: 56,
      height: 56,
      properties: {
        src: '',
        alt: 'Avatar',
        variant: 'circular',
        size: 'medium'
      }
    }
  },
  {
    type: 'ui-menu',
    label: 'UI Menu',
    icon: <ViewModule />,
    category: 'Utilities',
    defaultProps: {
      width: 200,
      height: 150,
      properties: {
        items: [
          { label: 'Menu Item 1', value: 'item1' },
          { label: 'Menu Item 2', value: 'item2' },
          { label: 'Menu Item 3', value: 'item3' }
        ],
        open: false
      }
    }
  },

  // ===== LEGACY COMPONENTS (keep for compatibility) =====
  {
    type: 'text',
    label: 'Text',
    icon: <TextFields />,
    category: 'Legacy',
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
    category: 'Legacy',
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
    type: 'enhanced-table',
    label: 'Enhanced Table',
    icon: <TableChart />,
    category: 'Data Management',
    defaultProps: {
      width: 600,
      height: 400,
      properties: {
        dataSource: 'projects',
        columns: [],
        rowsPerPage: 10,
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        enableSearch: true,
        enableColumnResizing: true,
        enableRowSelection: false,
        enableEditing: false,
        pageSize: 10
      }
    }
  }
];

// Canvas Element Component with working drag/resize
    [
      {
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
const CanvasElement = ({ element, isSelected, onUpdate, onDelete, onSelect, isPreviewMode = false, project }) => {
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
        const options = Array.isArray(properties.options) ? properties.options : [];
        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel>{properties.label}</InputLabel>
            <Select
              value={properties.value || ''}
              label={properties.label}
              disabled={locked}
              onChange={(e) => onUpdate({ properties: { ...properties, value: e.target.value } })}
            >
              {options.map((option, index) => (
                <MenuItem 
                  key={option.value || index} 
                  value={option.value || ''}
                >
                  {option.label || option.value || `Option ${index + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
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
      case 'enhanced-table':
        return (
          <EnhancedTableComponent
            component={element}
            onPropertyChange={onUpdate}
            designId={project?.id}
            styles={commonStyles}
            isEditMode={!isPreviewMode}
          />
        );

      // ===== NEW UI COMPONENTS =====
      
      // Button Components
      case 'ui-button':
        return (
          <UIButton
            variant={properties.variant || 'contained'}
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={properties.disabled || locked}
            fullWidth={properties.fullWidth}
            sx={commonStyles}
          >
            {properties.children || 'Button'}
          </UIButton>
        );

      case 'ui-button-solid':
        return (
          <ButtonSolid
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={locked}
            sx={commonStyles}
          >
            {properties.children || 'Solid Button'}
          </ButtonSolid>
        );

      case 'ui-button-outline':
        return (
          <ButtonOutline
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={locked}
            sx={commonStyles}
          >
            {properties.children || 'Outline Button'}
          </ButtonOutline>
        );

      case 'ui-button-text':
        return (
          <ButtonText
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={locked}
            sx={commonStyles}
          >
            {properties.children || 'Text Button'}
          </ButtonText>
        );

      case 'ui-icon-button':
        return (
          <UIIconButton
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={locked}
            sx={commonStyles}
          >
            <SettingsIcon />
          </UIIconButton>
        );

      case 'ui-floating-action-button':
        return (
          <FloatingActionButton
            color={properties.color || 'primary'}
            size={properties.size || 'medium'}
            disabled={locked}
            sx={commonStyles}
          >
            <AddIcon />
          </FloatingActionButton>
        );

      // Input Components
      case 'ui-input':
        return (
          <UIInput
            placeholder={properties.placeholder || 'Enter text...'}
            label={properties.label || 'Input Label'}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-password-input':
        return (
          <PasswordInput
            placeholder={properties.placeholder || 'Enter password...'}
            label={properties.label || 'Password'}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-email-input':
        return (
          <EmailInput
            placeholder={properties.placeholder || 'Enter email...'}
            label={properties.label || 'Email'}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-search-input':
        return (
          <SearchInput
            placeholder={properties.placeholder || 'Search...'}
            label={properties.label || 'Search'}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-textarea':
        return (
          <UITextArea
            placeholder={properties.placeholder || 'Enter text...'}
            label={properties.label || 'Text Area'}
            rows={properties.rows || 4}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      // Select Components
      case 'ui-select':
        return (
          <UISelect
            label={properties.label || 'Select Option'}
            options={properties.options || []}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-multi-select':
        return (
          <MultiSelect
            label={properties.label || 'Select Multiple'}
            options={properties.options || []}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-combobox':
        return (
          <Combobox
            label={properties.label || 'Combobox'}
            options={properties.options || []}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      // Form Control Components
      case 'ui-radio-group':
        return (
          <UIRadioGroup
            label={properties.label || 'Radio Group'}
            options={properties.options || []}
            value={properties.value}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-checkbox':
        return (
          <UICheckbox
            label={properties.label || 'Checkbox Label'}
            checked={properties.checked || false}
            color={properties.color || 'primary'}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-switch':
        return (
          <UISwitch
            label={properties.label || 'Switch Label'}
            checked={properties.checked || false}
            color={properties.color || 'primary'}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-toggle':
        return (
          <Toggle
            label={properties.label || 'Toggle Label'}
            checked={properties.checked || false}
            color={properties.color || 'primary'}
            disabled={locked}
            sx={commonStyles}
          />
        );

      // Modal Components (shown as preview cards)
      case 'ui-modal':
      case 'ui-confirm-modal':
      case 'ui-alert-modal':
      case 'ui-form-modal':
        return (
          <Box
            sx={{
              ...commonStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ccc',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {properties.title || 'Modal'} (Preview)
            </Typography>
          </Box>
        );

      // Card Components
      case 'ui-card':
        return (
          <UICard
            title={properties.title || 'Card Title'}
            content={properties.content || 'Card content goes here...'}
            elevation={properties.elevation || 1}
            variant={properties.variant || 'elevation'}
            sx={commonStyles}
          />
        );

      case 'ui-action-card':
        return (
          <ActionCard
            title={properties.title || 'Action Card'}
            content={properties.content || 'Card with action buttons'}
            primaryAction={properties.primaryAction || 'Primary'}
            secondaryAction={properties.secondaryAction || 'Secondary'}
            sx={commonStyles}
          />
        );

      case 'ui-stats-card':
        return (
          <StatsCard
            title={properties.title || 'Total Users'}
            value={properties.value || '1,234'}
            trend={properties.trend || '+12%'}
            color={properties.color || 'primary'}
            sx={commonStyles}
          />
        );

      case 'ui-feature-card':
        return (
          <FeatureCard
            title={properties.title || 'Feature Title'}
            description={properties.description || 'Feature description goes here...'}
            icon={properties.icon || 'Star'}
            color={properties.color || 'primary'}
            sx={commonStyles}
          />
        );

      // Navigation Components
      case 'ui-search-box':
        return (
          <SearchBox
            placeholder={properties.placeholder || 'Search...'}
            variant={properties.variant || 'outlined'}
            fullWidth={properties.fullWidth}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-advanced-search-box':
        return (
          <AdvancedSearchBox
            placeholder={properties.placeholder || 'Advanced search...'}
            variant={properties.variant || 'outlined'}
            showFilters={properties.showFilters}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-pagination':
        return (
          <UIPagination
            count={properties.count || 10}
            page={properties.page || 1}
            variant={properties.variant || 'outlined'}
            color={properties.color || 'primary'}
            disabled={locked}
            sx={commonStyles}
          />
        );

      case 'ui-advanced-pagination':
        return (
          <AdvancedPagination
            count={properties.count || 10}
            page={properties.page || 1}
            showFirstButton={properties.showFirstButton}
            showLastButton={properties.showLastButton}
            siblingCount={properties.siblingCount || 1}
            disabled={locked}
            sx={commonStyles}
          />
        );

      // Feedback Components
      case 'ui-alert':
        return (
          <UIAlert
            message={properties.message || 'This is an alert message'}
            severity={properties.severity || 'info'}
            variant={properties.variant || 'filled'}
            closable={properties.closable}
            sx={commonStyles}
          />
        );

      case 'ui-success-alert':
        return (
          <SuccessAlert
            message={properties.message || 'Success! Operation completed.'}
            variant={properties.variant || 'filled'}
            sx={commonStyles}
          />
        );

      case 'ui-error-alert':
        return (
          <ErrorAlert
            message={properties.message || 'Error! Something went wrong.'}
            variant={properties.variant || 'filled'}
            sx={commonStyles}
          />
        );

      case 'ui-warning-alert':
        return (
          <WarningAlert
            message={properties.message || 'Warning! Please check your input.'}
            variant={properties.variant || 'filled'}
            sx={commonStyles}
          />
        );

      case 'ui-toast':
        return (
          <Toast
            message={properties.message || 'Toast notification'}
            position={properties.position || 'top-right'}
            duration={properties.duration || 4000}
            type={properties.type || 'info'}
            sx={commonStyles}
          />
        );

      // Loading Components
      case 'ui-spinner':
        return (
          <Spinner
            size={properties.size || 'medium'}
            color={properties.color || 'primary'}
            variant={properties.variant || 'indeterminate'}
            sx={commonStyles}
          />
        );

      case 'ui-progress-bar':
        return (
          <ProgressBar
            value={properties.value || 50}
            variant={properties.variant || 'determinate'}
            color={properties.color || 'primary'}
            sx={commonStyles}
          />
        );

      case 'ui-loading-overlay':
        return (
          <LoadingOverlay
            loading={properties.loading}
            message={properties.message || 'Loading...'}
            color={properties.color || 'primary'}
            sx={commonStyles}
          />
        );

      // Layout Components (shown as preview containers)
      case 'ui-drawer':
      case 'ui-header':
      case 'ui-sidebar-layout':
      case 'ui-accordion':
        return (
          <Box
            sx={{
              ...commonStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ccc',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {type.replace('ui-', '').replace('-', ' ').toUpperCase()} (Layout Preview)
            </Typography>
          </Box>
        );

      // Utility Components
      case 'ui-tooltip':
        return (
          <UITooltip
            title={properties.title || 'Tooltip text'}
            placement={properties.placement || 'top'}
            arrow={properties.arrow}
            sx={commonStyles}
          >
            <Box sx={{ ...commonStyles, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2">
                {properties.children || 'Hover me'}
              </Typography>
            </Box>
          </UITooltip>
        );

      case 'ui-badge':
        return (
          <UIBadge
            badgeContent={properties.badgeContent || 4}
            color={properties.color || 'error'}
            variant={properties.variant || 'standard'}
            sx={commonStyles}
          >
            <Box sx={{ ...commonStyles, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2">
                {properties.children || 'Badge'}
              </Typography>
            </Box>
          </UIBadge>
        );

      case 'ui-avatar':
        return (
          <UIAvatar
            src={properties.src}
            alt={properties.alt || 'Avatar'}
            variant={properties.variant || 'circular'}
            size={properties.size || 'medium'}
            sx={commonStyles}
          />
        );

      case 'ui-menu':
        return (
          <Box
            sx={{
              ...commonStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ccc',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Menu (Preview)
            </Typography>
          </Box>
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
        if (isPreviewMode) return;
        setIsDragging(false);
        onUpdate({ x: d.x, y: d.y });
      }}
      onDrag={() => !isPreviewMode && setIsDragging(true)}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (isPreviewMode) return;
        setIsResizing(false);
        onUpdate({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      onResize={() => !isPreviewMode && setIsResizing(true)}
      onClick={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        onSelect(id);
      }}
      onMouseEnter={() => !isPreviewMode && setIsHovered(true)}
      onMouseLeave={() => !isPreviewMode && setIsHovered(false)}
      disableDragging={locked || isPreviewMode}
      enableResizing={!locked && !isPreviewMode}
      dragHandleClassName="drag-handle"
      bounds="parent"
      style={{
        border: (isSelected && !isPreviewMode) ? '2px solid #2B9CAE' : '1px solid transparent',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: isPreviewMode ? 'default' : (locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab'),
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
          display: (isSelected && !isPreviewMode) ? 'block' : 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Drag Handle - Invisible overlay that allows dragging */}
        {!locked && !isPreviewMode && (
          <Box
            className="drag-handle"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20px',
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: isSelected || isHovered ? 'rgba(43, 156, 174, 0.08)' : 'transparent',
              borderBottom: isSelected || isHovered ? '1px dashed rgba(43, 156, 174, 0.3)' : 'none',
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
            paddingTop: (!locked && !isPreviewMode) ? '20px' : 0,
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
    project,
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
    saveProject,
    loadProject,
    newProject,
  } = useCanvasStore();

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Component library search and recently used
  const [componentSearch, setComponentSearch] = useState('');
  const [recentlyUsed, setRecentlyUsed] = useState(() => {
    const saved = localStorage.getItem('ace-recently-used-components');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyRecent, setShowOnlyRecent] = useState(false);

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

  // Project management effect
  useEffect(() => {
    const initializeProject = async () => {
      if (projectId) {
        // Load existing project
        const loaded = await loadProject(projectId);
        if (loaded && project) {
          setProjectName(project.name || `Project ${projectId}`);
          setProjectDescription(project.description || '');
        }
      } else {
        // Create new project
        newProject();
        setProjectName('Untitled Design');
        setProjectDescription('');
      }
    };

    initializeProject();
  }, [projectId, loadProject, newProject]);

  // Update project name from store
  useEffect(() => {
    if (project && project.name) {
      setProjectName(project.name);
    }
  }, [project]);

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

    // Update recently used components
    const updatedRecent = [componentType, ...recentlyUsed.filter(type => type !== componentType)].slice(0, 10);
    setRecentlyUsed(updatedRecent);
    localStorage.setItem('ace-recently-used-components', JSON.stringify(updatedRecent));

    setNotification({
      open: true,
      message: `Added ${component.label} component`,
      severity: 'success',
    });
  }, [addElement, selectElement, generateId, recentlyUsed]);

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
      // Use the canvas store's saveProject function with current project name and description
      const savedProjectId = await saveProject(projectName, projectDescription);
      
      if (savedProjectId) {
        setNotification({
          open: true,
          message: `Design "${projectName}" saved successfully!`,
          severity: 'success',
        });
        setSaveDialogOpen(false);
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Save error:', error);
      setNotification({
        open: true,
        message: 'Failed to save design. Please try again.',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [saveProject, projectName, projectDescription]);

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
              
              {/* Search Input */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search components..."
                value={componentSearch}
                onChange={(e) => setComponentSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} />,
                  endAdornment: componentSearch && (
                    <IconButton
                      size="small"
                      onClick={() => setComponentSearch('')}
                      sx={{ p: 0.5 }}
                    >
                      <Clear sx={{ fontSize: '16px' }} />
                    </IconButton>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2B9CAE',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2B9CAE',
                      },
                    },
                  },
                }}
              />

              {/* Toggle Recently Used */}
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyRecent}
                    onChange={(e) => setShowOnlyRecent(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2B9CAE',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(43, 156, 174, 0.5)',
                      },
                    }}
                  />
                }
                label="Recently Used Only"
                sx={{ 
                  color: '#4A5568', 
                  mb: 2,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                  },
                }}
              />

              {/* Filter and display components */}
              {(() => {
                // Filter components based on search and recently used
                const getFilteredComponents = () => {
                  let components = componentLibrary;
                  
                  if (showOnlyRecent && recentlyUsed.length > 0) {
                    components = recentlyUsed.map(type => 
                      componentLibrary.find(comp => comp.type === type)
                    ).filter(Boolean);
                  }
                  
                  if (componentSearch) {
                    const searchLower = componentSearch.toLowerCase();
                    components = components.filter(comp => 
                      comp.label.toLowerCase().includes(searchLower) ||
                      comp.category.toLowerCase().includes(searchLower) ||
                      comp.type.toLowerCase().includes(searchLower)
                    );
                  }
                  
                  return components;
                };

                const filteredComponents = getFilteredComponents();

                if (showOnlyRecent && filteredComponents.length > 0) {
                  // Show recently used components in a flat grid
                  return (
                    <Box>
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
                        Recently Used ({filteredComponents.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {filteredComponents.map((component) => (
                          <Grid item xs={4} key={component.type}>
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => addComponent(component.type)}
                              sx={{
                                height: '70px',
                                flexDirection: 'column',
                                gap: 0.5,
                                fontSize: '10px',
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
                                  fontSize: '1.1rem',
                                },
                              }}
                            >
                              {component.icon}
                              <Box sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                                {component.label}
                              </Box>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                } else if (componentSearch && filteredComponents.length > 0) {
                  // Show search results in a flat grid
                  return (
                    <Box>
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
                        Search Results ({filteredComponents.length})
                      </Typography>
                      <Grid container spacing={1}>
                        {filteredComponents.map((component) => (
                          <Grid item xs={4} key={component.type}>
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => addComponent(component.type)}
                              sx={{
                                height: '70px',
                                flexDirection: 'column',
                                gap: 0.5,
                                fontSize: '10px',
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
                                  fontSize: '1.1rem',
                                },
                              }}
                            >
                              {component.icon}
                              <Box sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                                {component.label}
                              </Box>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                } else if (componentSearch && filteredComponents.length === 0) {
                  // No search results
                  return (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No components found for "{componentSearch}"
                      </Typography>
                    </Box>
                  );
                } else {
                  // Group components by category with three-column layout
                  const categories = [
                    'Buttons & Actions', 
                    'Form Controls', 
                    'Modals & Dialogs', 
                    'Cards & Display', 
                    'Navigation', 
                    'Feedback', 
                    'Loading', 
                    'Layout', 
                    'Utilities', 
                    'Data Management',
                    'Legacy'
                  ];
                  
                  return categories.map((category) => {
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
                            <Grid item xs={4} key={component.type}>
                              <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => addComponent(component.type)}
                                sx={{
                                  height: '70px',
                                  flexDirection: 'column',
                                  gap: 0.5,
                                  fontSize: '10px',
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
                                    fontSize: '1.1rem',
                                  },
                                }}
                              >
                                {component.icon}
                                <Box sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                                  {component.label}
                                </Box>
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    );
                  });
                }
              })()}

              <Divider sx={{ my: 2, borderColor: '#E2E8F0' }} />

              <Typography variant="h6" gutterBottom sx={{ color: '#2D3748', fontWeight: 600 }}>
                Canvas Settings
              </Typography>
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Canvas Size</InputLabel>
                <Select
                  value={`${canvasSettings.width || 1200}x${canvasSettings.height || 900}`}
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
                  width: canvasSettings.width || 1200,
                  height: canvasSettings.height || 900,
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
                    project={project}
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
              designId={project?.id}
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
                  value={projectMetadata.category || ''}
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
                  • Canvas size: {canvasSettings.width || 1200} × {canvasSettings.height || 900}
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
                  • Canvas: {canvasSettings.width || 1200} × {canvasSettings.height || 900}
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
          <DialogTitle sx={{ bgcolor: '#2B9CAE', color: 'white' }}>
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
                  width: canvasSettings.width || 1200,
                  height: canvasSettings.height || 900,
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
                      pointerEvents: 'none', // Disable interactions in preview
                    }}
                  >
                    {/* Render preview using CanvasElement component in preview mode */}
                    <CanvasElement
                      element={element}
                      isSelected={false}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      onSelect={() => {}}
                      isPreviewMode={true}
                      project={project}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Publish Dialog */}
        <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: '#5A7A8F', color: 'white' }}>
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
