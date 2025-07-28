// UI Component Library - Ace Template Engine
// Based on reference project components with Material-UI implementation

// Core Components
export { default as Button, ButtonSolid, ButtonOutline, ButtonText, IconButton } from './Button';
export { default as Input, PasswordInput, EmailInput, SearchInput, CopyableInput, TextArea } from './Input';
export { default as Modal, ConfirmModal, AlertModal, FormModal } from './Modal';
export { default as Card, ActionCard, StatsCard, FeatureCard } from './Card';

// Form Controls
export { 
  default as RadioGroup, 
  Radio, 
  CheckboxGroup, 
  Checkbox, 
  Switch, 
  Toggle, 
  FormField 
} from './FormControls';

export { 
  default as Select, 
  MultiSelect, 
  Combobox, 
  NativeSelect, 
  GroupedSelect 
} from './Select';

// Layout Components
export { 
  default as Drawer, 
  NavigationDrawer, 
  SidebarLayout, 
  MiniDrawer, 
  RightPanel 
} from './Drawer';

export { 
  default as Header, 
  NavigationHeader, 
  PageHeader, 
  AppBar, 
  StatusHeader 
} from './Header';

export { 
  default as Accordion, 
  AccordionGroup, 
  CollapsibleSection, 
  FAQAccordion, 
  SettingsAccordion 
} from './Accordion';

// Navigation Components
export { 
  default as SearchBox, 
  AdvancedSearchBox, 
  SearchWithSuggestions, 
  GlobalSearch 
} from './SearchBox';

export { 
  default as Pagination, 
  TablePaginationComponent as TablePagination, 
  AdvancedPagination, 
  SimplePageNav, 
  LoadMorePagination 
} from './Pagination';

// Feedback Components
export { 
  default as Alert, 
  Toast, 
  SuccessAlert, 
  ErrorAlert, 
  WarningAlert, 
  InfoAlert, 
  InlineAlert, 
  BannerAlert 
} from './Alert';

export { 
  default as Spinner, 
  ProgressBar, 
  LoadingOverlay, 
  InlineLoader, 
  PageLoader, 
  ButtonLoader, 
  SkeletonLoader, 
  StepProgress 
} from './Loading';

// Utility Components
export { 
  default as Tooltip, 
  IconButton as TooltipIconButton, 
  FloatingActionButton, 
  ActionSpeedDial, 
  RichTooltip, 
  HelpTooltip 
} from './Tooltip';

// Badge and Avatar Components
export { Badge, NotificationBadge, StatusBadge, Avatar, UserAvatar, AvatarGroup, UploadAvatar } from './Badge';

// Menu Components
export { 
  Menu, 
  ContextMenu, 
  DropdownMenu, 
  ActionMenu, 
  SelectMenu, 
  NestedMenu 
} from './Menu';

// Component Showcase
export { AdvancedComponentLibrary, ComponentShowcase } from './ComponentShowcase';

// Component Library Info
export const UILibraryInfo = {
  name: 'Ace Template Engine UI Library',
  version: '1.0.0',
  description: 'Comprehensive UI component library based on Material-UI with custom theming',
  theme: {
    primary: '#2B9CAE',
    secondary: '#f5f5f5',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
  components: [
    'Button', 'Input', 'Modal', 'Card', 'RadioGroup', 'Select', 
    'Drawer', 'Header', 'Alert', 'Loading', 'Tooltip', 'Accordion',
    'SearchBox', 'Pagination'
  ]
};

// Utility functions for theming
export const getThemeColor = (color) => {
  const colors = {
    primary: '#2B9CAE',
    secondary: '#f5f5f5',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#2c3e50',
  };
  return colors[color] || color;
};

export const createComponentVariant = (baseComponent, defaultProps) => {
  return (props) => baseComponent({ ...defaultProps, ...props });
};

// Export all components as a single object for easier importing
export const UIComponents = {
  Button,
  ButtonSolid,
  ButtonOutline,
  ButtonText,
  IconButton,
  Input,
  PasswordInput,
  EmailInput,
  SearchInput,
  CopyableInput,
  TextArea,
  Modal,
  ConfirmModal,
  AlertModal,
  FormModal,
  Card,
  ActionCard,
  StatsCard,
  FeatureCard,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Switch,
  Toggle,
  FormField,
  Select,
  MultiSelect,
  Combobox,
  NativeSelect,
  GroupedSelect,
  Drawer,
  NavigationDrawer,
  SidebarLayout,
  MiniDrawer,
  RightPanel,
  Header,
  NavigationHeader,
  PageHeader,
  AppBar,
  StatusHeader,
  Accordion,
  AccordionGroup,
  CollapsibleSection,
  FAQAccordion,
  SettingsAccordion,
  SearchBox,
  AdvancedSearchBox,
  SearchWithSuggestions,
  GlobalSearch,
  Pagination,
  TablePagination,
  AdvancedPagination,
  SimplePageNav,
  LoadMorePagination,
  Alert,
  Toast,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
  InlineAlert,
  BannerAlert,
  Spinner,
  ProgressBar,
  LoadingOverlay,
  InlineLoader,
  PageLoader,
  ButtonLoader,
  SkeletonLoader,
  StepProgress,
  Tooltip,
  FloatingActionButton,
  ActionSpeedDial,
  RichTooltip,
  HelpTooltip,
  ComponentShowcase,
};
