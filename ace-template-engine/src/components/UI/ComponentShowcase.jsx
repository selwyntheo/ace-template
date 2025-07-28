import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tab,
  Tabs,
  Paper,
  Divider,
  Chip,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Collapse,
  Autocomplete,
  TextField,
  FormControlLabel,
  Switch as MuiSwitch
} from '@mui/material';
import {
  Dashboard,
  Settings,
  Search,
  Notifications,
  Person,
  Home,
  Folder,
  Edit,
  Delete,
  Add,
  Save,
  ExpandMore,
  ExpandLess,
  Visibility,
  VisibilityOff,
  FilterList,
  Code,
  Preview
} from '@mui/icons-material';

// Import all UI components
import {
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
  Checkbox,
  Switch,
  Toggle,
  Select,
  MultiSelect,
  ComboBox,
  NativeSelect,
  AdvancedSelect,
  Drawer,
  SidebarLayout,
  NavigationHeader,
  PageHeader,
  AppBarHeader,
  Alert,
  ToastAlert,
  BannerAlert,
  Spinner,
  ProgressBar,
  LoadingOverlay,
  Tooltip,
  RichTooltip,
  HelpTooltip,
  FloatingActionButton,
  ActionSpeedDial,
  Badge,
  NotificationBadge,
  StatusBadge,
  Avatar,
  UserAvatar,
  AvatarGroup,
  UploadAvatar,
  Menu,
  ContextMenu,
  DropdownMenu,
  ActionMenu,
  SelectMenu,
  NestedMenu
} from './index';

import Accordion, { AccordionGroup, FAQAccordion, SettingsAccordion } from './Accordion';
import SearchBox, { AdvancedSearchBox, SearchWithSuggestions, GlobalSearchBox } from './SearchBox';
import Pagination, { AdvancedPagination, LoadMorePagination, TablePagination } from './Pagination';

const AdvancedComponentLibrary = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'
  const [filterCategory, setFilterCategory] = useState('all');
  
  // State for interactive components
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    basic: '',
    password: '',
    email: '',
    search: '',
    textarea: '',
    copyable: 'Copy this text!'
  });
  const [selectValue, setSelectValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState([]);
  const [radioValue, setRadioValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const componentCategories = [
    {
      id: 'buttons',
      title: 'Buttons & Actions',
      description: 'Interactive button components and action triggers',
      components: [
        {
          name: 'Button',
          component: Button,
          props: { children: 'Default Button' },
          code: `<Button>Default Button</Button>`
        },
        {
          name: 'ButtonSolid',
          component: ButtonSolid,
          props: { children: 'Primary', variant: 'primary' },
          code: `<ButtonSolid variant="primary">Primary</ButtonSolid>`
        },
        {
          name: 'ButtonOutline',
          component: ButtonOutline,
          props: { children: 'Outline Button' },
          code: `<ButtonOutline>Outline Button</ButtonOutline>`
        },
        {
          name: 'ButtonText',
          component: ButtonText,
          props: { children: 'Text Button' },
          code: `<ButtonText>Text Button</ButtonText>`
        },
        {
          name: 'IconButton',
          component: IconButton,
          props: { children: <Settings />, tooltip: 'Settings' },
          code: `<IconButton tooltip="Settings"><Settings /></IconButton>`
        },
        {
          name: 'FloatingActionButton',
          component: FloatingActionButton,
          props: { children: <Add />, tooltip: 'Add Item' },
          code: `<FloatingActionButton tooltip="Add Item"><Add /></FloatingActionButton>`
        },
        {
          name: 'ActionSpeedDial',
          component: ActionSpeedDial,
          props: {
            actions: [
              { name: 'Edit', icon: <Edit />, onClick: () => {} },
              { name: 'Delete', icon: <Delete />, onClick: () => {} }
            ],
            open: speedDialOpen,
            onOpen: () => setSpeedDialOpen(true),
            onClose: () => setSpeedDialOpen(false)
          },
          code: `<ActionSpeedDial actions={actions} />`
        }
      ]
    },
    {
      id: 'inputs',
      title: 'Form Inputs',
      description: 'Input fields and form controls',
      components: [
        {
          name: 'Input',
          component: Input,
          props: {
            label: 'Basic Input',
            value: inputValues.basic,
            onChange: (e) => setInputValues(prev => ({ ...prev, basic: e.target.value }))
          },
          code: `<Input label="Basic Input" value={value} onChange={onChange} />`
        },
        {
          name: 'PasswordInput',
          component: PasswordInput,
          props: {
            label: 'Password',
            value: inputValues.password,
            onChange: (e) => setInputValues(prev => ({ ...prev, password: e.target.value }))
          },
          code: `<PasswordInput label="Password" value={value} onChange={onChange} />`
        },
        {
          name: 'EmailInput',
          component: EmailInput,
          props: {
            label: 'Email Address',
            value: inputValues.email,
            onChange: (e) => setInputValues(prev => ({ ...prev, email: e.target.value }))
          },
          code: `<EmailInput label="Email Address" value={value} onChange={onChange} />`
        },
        {
          name: 'SearchInput',
          component: SearchInput,
          props: {
            placeholder: 'Search...',
            value: inputValues.search,
            onChange: (e) => setInputValues(prev => ({ ...prev, search: e.target.value }))
          },
          code: `<SearchInput placeholder="Search..." value={value} onChange={onChange} />`
        },
        {
          name: 'CopyableInput',
          component: CopyableInput,
          props: {
            label: 'Copyable Input',
            value: inputValues.copyable,
            readOnly: true
          },
          code: `<CopyableInput label="Copyable Input" value="Copy this text!" readOnly />`
        },
        {
          name: 'TextArea',
          component: TextArea,
          props: {
            label: 'Description',
            value: inputValues.textarea,
            onChange: (e) => setInputValues(prev => ({ ...prev, textarea: e.target.value }))
          },
          code: `<TextArea label="Description" value={value} onChange={onChange} />`
        }
      ]
    },
    {
      id: 'modals',
      title: 'Modals & Dialogs',
      description: 'Modal dialogs and overlay components',
      components: [
        {
          name: 'Modal',
          component: () => (
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          ),
          code: `<Modal open={open} onClose={onClose} title="Modal Title">Content</Modal>`
        },
        {
          name: 'ConfirmModal',
          component: () => (
            <Button onClick={() => setConfirmModalOpen(true)}>Open Confirm Modal</Button>
          ),
          code: `<ConfirmModal open={open} onClose={onClose} onConfirm={onConfirm} />`
        },
        {
          name: 'AlertModal',
          component: () => (
            <Button onClick={() => setAlertModalOpen(true)}>Open Alert Modal</Button>
          ),
          code: `<AlertModal open={open} onClose={onClose} title="Alert" message="Alert message" />`
        },
        {
          name: 'FormModal',
          component: () => (
            <Button onClick={() => setFormModalOpen(true)}>Open Form Modal</Button>
          ),
          code: `<FormModal open={open} onClose={onClose} title="Form Modal">Form content</FormModal>`
        }
      ]
    },
    {
      id: 'cards',
      title: 'Cards & Containers',
      description: 'Card layouts and content containers',
      components: [
        {
          name: 'Card',
          component: Card,
          props: {
            title: 'Basic Card',
            children: 'This is a basic card with some content.'
          },
          code: `<Card title="Basic Card">Content</Card>`
        },
        {
          name: 'ActionCard',
          component: ActionCard,
          props: {
            title: 'Action Card',
            children: 'Card with action buttons',
            actions: [
              { label: 'Edit', onClick: () => {} },
              { label: 'Delete', onClick: () => {} }
            ]
          },
          code: `<ActionCard title="Action Card" actions={actions}>Content</ActionCard>`
        },
        {
          name: 'StatsCard',
          component: StatsCard,
          props: {
            title: 'Total Users',
            value: '1,234',
            change: '+12%',
            trend: 'up'
          },
          code: `<StatsCard title="Total Users" value="1,234" change="+12%" trend="up" />`
        },
        {
          name: 'FeatureCard',
          component: FeatureCard,
          props: {
            icon: <Dashboard />,
            title: 'Dashboard',
            description: 'Comprehensive dashboard view',
            href: '#'
          },
          code: `<FeatureCard icon={<Dashboard />} title="Dashboard" description="..." href="#" />`
        }
      ]
    },
    {
      id: 'form-controls',
      title: 'Form Controls',
      description: 'Form input controls and selectors',
      components: [
        {
          name: 'RadioGroup',
          component: RadioGroup,
          props: {
            label: 'Choose Option',
            value: radioValue,
            onChange: setRadioValue,
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]
          },
          code: `<RadioGroup label="Choose Option" value={value} onChange={onChange} options={options} />`
        },
        {
          name: 'Checkbox',
          component: Checkbox,
          props: {
            label: 'Check me',
            checked: checkboxValue,
            onChange: setCheckboxValue
          },
          code: `<Checkbox label="Check me" checked={checked} onChange={onChange} />`
        },
        {
          name: 'Switch',
          component: Switch,
          props: {
            label: 'Enable feature',
            checked: switchValue,
            onChange: setSwitchValue
          },
          code: `<Switch label="Enable feature" checked={checked} onChange={onChange} />`
        },
        {
          name: 'Toggle',
          component: Toggle,
          props: {
            label: 'Toggle me',
            checked: toggleValue,
            onChange: setToggleValue
          },
          code: `<Toggle label="Toggle me" checked={checked} onChange={onChange} />`
        },
        {
          name: 'Select',
          component: Select,
          props: {
            label: 'Select Option',
            value: selectValue,
            onChange: setSelectValue,
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]
          },
          code: `<Select label="Select Option" value={value} onChange={onChange} options={options} />`
        },
        {
          name: 'MultiSelect',
          component: MultiSelect,
          props: {
            label: 'Multi Select',
            value: multiSelectValue,
            onChange: setMultiSelectValue,
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]
          },
          code: `<MultiSelect label="Multi Select" value={value} onChange={onChange} options={options} />`
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Navigation',
      description: 'Navigation components and layouts',
      components: [
        {
          name: 'NavigationHeader',
          component: NavigationHeader,
          props: {
            title: 'App Title',
            user: { name: 'John Doe', avatar: 'JD' },
            onMenuClick: () => setDrawerOpen(true)
          },
          code: `<NavigationHeader title="App Title" user={user} onMenuClick={onMenuClick} />`
        },
        {
          name: 'PageHeader',
          component: PageHeader,
          props: {
            title: 'Page Title',
            subtitle: 'Page description',
            breadcrumbs: ['Home', 'Dashboard', 'Current Page']
          },
          code: `<PageHeader title="Page Title" subtitle="..." breadcrumbs={breadcrumbs} />`
        },
        {
          name: 'AppBarHeader',
          component: AppBarHeader,
          props: {
            title: 'Application',
            showSearch: true,
            actions: [
              { icon: <Notifications />, onClick: () => {} },
              { icon: <Settings />, onClick: () => {} }
            ]
          },
          code: `<AppBarHeader title="Application" showSearch actions={actions} />`
        },
        {
          name: 'Drawer',
          component: () => (
            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          ),
          code: `<Drawer open={open} onClose={onClose}>Navigation content</Drawer>`
        }
      ]
    },
    {
      id: 'feedback',
      title: 'Feedback & Alerts',
      description: 'User feedback and notification components',
      components: [
        {
          name: 'Alert',
          component: Alert,
          props: {
            severity: 'success',
            message: 'This is a success alert!'
          },
          code: `<Alert severity="success" message="Success message!" />`
        },
        {
          name: 'ToastAlert',
          component: ToastAlert,
          props: {
            severity: 'info',
            message: 'This is a toast notification'
          },
          code: `<ToastAlert severity="info" message="Toast message" />`
        },
        {
          name: 'BannerAlert',
          component: BannerAlert,
          props: {
            severity: 'warning',
            message: 'This is a banner alert'
          },
          code: `<BannerAlert severity="warning" message="Warning message" />`
        },
        {
          name: 'Spinner',
          component: Spinner,
          props: { size: 'medium' },
          code: `<Spinner size="medium" />`
        },
        {
          name: 'ProgressBar',
          component: ProgressBar,
          props: { value: 65, label: 'Loading...' },
          code: `<ProgressBar value={65} label="Loading..." />`
        },
        {
          name: 'LoadingOverlay',
          component: LoadingOverlay,
          props: { 
            loading: true,
            children: <Box sx={{ p: 4 }}>Content behind overlay</Box>
          },
          code: `<LoadingOverlay loading={true}>Content</LoadingOverlay>`
        }
      ]
    },
    {
      id: 'tooltips',
      title: 'Tooltips & Hints',
      description: 'Tooltip and help components',
      components: [
        {
          name: 'Tooltip',
          component: () => (
            <Tooltip title="This is a tooltip">
              <Button>Hover me</Button>
            </Tooltip>
          ),
          code: `<Tooltip title="Tooltip text"><Button>Hover me</Button></Tooltip>`
        },
        {
          name: 'RichTooltip',
          component: () => (
            <RichTooltip 
              title="Rich Tooltip" 
              content="This tooltip has rich content with formatting"
            >
              <Button>Rich Tooltip</Button>
            </RichTooltip>
          ),
          code: `<RichTooltip title="Title" content="Rich content"><Button>Rich Tooltip</Button></RichTooltip>`
        },
        {
          name: 'HelpTooltip',
          component: HelpTooltip,
          props: { content: 'This is help information' },
          code: `<HelpTooltip content="Help information" />`
        }
      ]
    },
    {
      id: 'badges-avatars',
      title: 'Badges & Avatars',
      description: 'Badge indicators and user avatars',
      components: [
        {
          name: 'Badge',
          component: Badge,
          props: {
            badgeContent: '4',
            children: <Notifications />
          },
          code: `<Badge badgeContent="4"><Notifications /></Badge>`
        },
        {
          name: 'NotificationBadge',
          component: NotificationBadge,
          props: {
            count: 5,
            children: <Person />
          },
          code: `<NotificationBadge count={5}><Person /></NotificationBadge>`
        },
        {
          name: 'StatusBadge',
          component: StatusBadge,
          props: {
            status: 'online',
            children: <Avatar>JD</Avatar>
          },
          code: `<StatusBadge status="online"><Avatar>JD</Avatar></StatusBadge>`
        },
        {
          name: 'Avatar',
          component: Avatar,
          props: { children: 'JD', size: 'medium' },
          code: `<Avatar size="medium">JD</Avatar>`
        },
        {
          name: 'UserAvatar',
          component: UserAvatar,
          props: {
            user: { name: 'John Doe', avatar: 'JD', status: 'online' }
          },
          code: `<UserAvatar user={user} />`
        },
        {
          name: 'AvatarGroup',
          component: AvatarGroup,
          props: {
            users: [
              { name: 'John Doe', avatar: 'JD' },
              { name: 'Jane Smith', avatar: 'JS' },
              { name: 'Bob Wilson', avatar: 'BW' }
            ],
            max: 2
          },
          code: `<AvatarGroup users={users} max={2} />`
        }
      ]
    },
    {
      id: 'menus',
      title: 'Menus & Dropdowns',
      description: 'Menu and dropdown components',
      components: [
        {
          name: 'ActionMenu',
          component: ActionMenu,
          props: {
            items: [
              { label: 'Edit', icon: <Edit />, onClick: () => {} },
              { label: 'Delete', icon: <Delete />, onClick: () => {} }
            ]
          },
          code: `<ActionMenu items={menuItems} />`
        },
        {
          name: 'DropdownMenu',
          component: DropdownMenu,
          props: {
            trigger: 'Open Menu',
            items: [
              { label: 'Option 1', onClick: () => {} },
              { label: 'Option 2', onClick: () => {} }
            ]
          },
          code: `<DropdownMenu trigger="Open Menu" items={items} />`
        },
        {
          name: 'SelectMenu',
          component: SelectMenu,
          props: {
            value: selectValue,
            onChange: setSelectValue,
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' }
            ],
            placeholder: 'Select an option'
          },
          code: `<SelectMenu value={value} onChange={onChange} options={options} />`
        }
      ]
    },
    {
      id: 'layout',
      title: 'Layout Components',
      description: 'Layout and organizational components',
      components: [
        {
          name: 'Accordion',
          component: Accordion,
          props: {
            title: 'Accordion Item',
            children: 'This is the accordion content that can be expanded or collapsed.'
          },
          code: `<Accordion title="Accordion Item">Content</Accordion>`
        },
        {
          name: 'AccordionGroup',
          component: AccordionGroup,
          props: {
            items: [
              { title: 'Item 1', content: 'Content for item 1' },
              { title: 'Item 2', content: 'Content for item 2' }
            ]
          },
          code: `<AccordionGroup items={accordionItems} />`
        },
        {
          name: 'SearchBox',
          component: SearchBox,
          props: {
            placeholder: 'Search components...',
            value: searchValue,
            onChange: setSearchValue
          },
          code: `<SearchBox placeholder="Search..." value={value} onChange={onChange} />`
        },
        {
          name: 'Pagination',
          component: Pagination,
          props: {
            currentPage: currentPage,
            totalPages: 10,
            onPageChange: setCurrentPage
          },
          code: `<Pagination currentPage={page} totalPages={10} onPageChange={onChange} />`
        }
      ]
    }
  ];

  const filteredCategories = componentCategories.filter(category => {
    if (filterCategory !== 'all' && category.id !== filterCategory) return false;
    if (searchQuery) {
      return category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             category.components.some(comp => 
               comp.name.toLowerCase().includes(searchQuery.toLowerCase())
             );
    }
    return true;
  });

  const ComponentDisplay = ({ component }) => {
    const Component = component.component;
    return (
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#2B9CAE' }}>
            {component.name}
          </Typography>
          <Chip 
            label={viewMode === 'preview' ? 'Preview' : 'Code'} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        {viewMode === 'preview' ? (
          <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, mb: 2 }}>
            <Component {...(component.props || {})} />
          </Box>
        ) : (
          <Box sx={{ p: 2, backgroundColor: '#1e1e1e', borderRadius: 1, mb: 2 }}>
            <Typography 
              component="pre" 
              sx={{ 
                color: '#ffffff', 
                fontSize: '0.875rem', 
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                margin: 0
              }}
            >
              {component.code}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const CategorySection = ({ category }) => {
    const isExpanded = expandedCategory === category.id;
    
    return (
      <MuiCard sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#2B9CAE' }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </Box>
              <Chip 
                label={`${category.components.length} components`} 
                variant="outlined" 
                size="small"
              />
            </Box>
          }
          action={
            <IconButton
              onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              sx={{ color: '#2B9CAE' }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          }
          sx={{ cursor: 'pointer' }}
          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
        />
        <Collapse in={isExpanded}>
          <CardContent>
            <Grid container spacing={2}>
              {category.components.map((component, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <ComponentDisplay component={component} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </MuiCard>
    );
  };

  const cardExamples = [
    {
      component: Card,
      label: 'Basic Card',
      props: {
        title: 'Card Title',
        subtitle: 'Card subtitle',
        children: <Typography>This is a basic card with some content.</Typography>
      }
    },
    {
      component: ActionCard,
      label: 'Action Card',
      props: {
        title: 'Action Card',
        description: 'Click to perform action',
        icon: <Dashboard />,
        onClick: () => alert('Action card clicked!')
      }
    },
    {
      component: StatsCard,
      label: 'Stats Card',
      props: {
        title: 'Total Users',
        value: '1,234',
        subtitle: 'Active users',
        icon: <Person />,
        trend: '+12% from last month',
        trendColor: 'success'
      }
    },
    {
      component: FeatureCard,
      label: 'Feature Card',
      props: {
        title: 'Dashboard',
        description: 'Manage your data',
        image: <Dashboard />,
        tags: ['NEW'],
        onClick: () => alert('Feature card clicked!')
      }
    }
  ];

  const formControlExamples = [
    {
      component: RadioGroup,
      label: 'Radio Group',
      props: {
        label: 'Choose an option',
        value: radioValue,
        onChange: (e) => setRadioValue(e.target.value),
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' }
        ]
      }
    },
    {
      component: Checkbox,
      label: 'Checkbox',
      props: {
        label: 'Accept terms and conditions',
        checked: checkboxValue,
        onChange: (e) => setCheckboxValue(e.target.checked)
      }
    },
    {
      component: Switch,
      label: 'Switch',
      props: {
        label: 'Enable notifications',
        checked: switchValue,
        onChange: (e) => setSwitchValue(e.target.checked)
      }
    },
    {
      component: Select,
      label: 'Select',
      props: {
        label: 'Choose a category',
        value: selectValue,
        onChange: (e) => setSelectValue(e.target.value),
        options: [
          { value: 'cat1', label: 'Category 1' },
          { value: 'cat2', label: 'Category 2' },
          { value: 'cat3', label: 'Category 3' }
        ]
      }
    },
    {
      component: MultiSelect,
      label: 'Multi Select',
      props: {
        label: 'Choose multiple',
        value: multiSelectValue,
        onChange: (e) => setMultiSelectValue(e.target.value),
        options: [
          { value: 'item1', label: 'Item 1' },
          { value: 'item2', label: 'Item 2' },
          { value: 'item3', label: 'Item 3' },
          { value: 'item4', label: 'Item 4' }
        ]
      }
    }
  ];

  const renderExampleSection = (title, examples) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {examples.map((example, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {example.label}
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <example.component {...example.props} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Buttons
        return renderExampleSection('Button Components', buttonExamples);
      
      case 1: // Inputs
        return renderExampleSection('Input Components', inputExamples);
      
      case 2: // Modals
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Modal Components
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Basic Modal
                  </Typography>
                  <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                  <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Sample Modal"
                    onConfirm={() => setModalOpen(false)}
                    onCancel={() => setModalOpen(false)}
                  >
                    <Typography>This is a sample modal with some content.</Typography>
                  </Modal>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Confirm Modal
                  </Typography>
                  <Button onClick={() => setConfirmModalOpen(true)}>Open Confirm Modal</Button>
                  <ConfirmModal
                    open={confirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    message="Are you sure you want to delete this item?"
                    onConfirm={() => {
                      alert('Confirmed!');
                      setConfirmModalOpen(false);
                    }}
                    onCancel={() => setConfirmModalOpen(false)}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3: // Cards
        return renderExampleSection('Card Components', cardExamples);
      
      case 4: // Form Controls
        return renderExampleSection('Form Control Components', formControlExamples);
      
      case 5: // Feedback
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Feedback Components
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Alerts
                  </Typography>
                  <Alert severity="success" sx={{ mb: 1 }}>Success message</Alert>
                  <Alert severity="warning" sx={{ mb: 1 }}>Warning message</Alert>
                  <Alert severity="error" sx={{ mb: 1 }}>Error message</Alert>
                  <Alert severity="info">Info message</Alert>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Loading
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Spinner size={20} />
                    <Typography variant="body2">Small spinner</Typography>
                  </Box>
                  <ProgressBar value={75} showLabel />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 6: // Navigation
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Navigation Components
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Search Box
                  </Typography>
                  <SearchBox
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search components..."
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Pagination
                  </Typography>
                  <Pagination
                    count={10}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 7: // Layout
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Layout Components
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Accordion
                  </Typography>
                  <Accordion title="Expandable Section" summary="Click to expand">
                    <Typography>
                      This is the content inside the accordion. It can contain any React elements.
                    </Typography>
                  </Accordion>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 8: // Data Display
        return (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Data Display Components
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    FAQ Accordion
                  </Typography>
                  <FAQAccordion
                    faqs={[
                      {
                        question: 'What is this component library?',
                        answer: 'This is a comprehensive UI component library built with Material-UI for the Ace Template Engine.'
                      },
                      {
                        question: 'How do I use these components?',
                        answer: 'Import the components from the UI library and use them in your React applications.'
                      }
                    ]}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="UI Component Library Showcase"
        subtitle="Comprehensive collection of reusable UI components"
        breadcrumbs={[
          { label: 'Home', icon: <Home /> },
          { label: 'Components' },
          { label: 'Showcase' }
        ]}
      />
      
      <Box sx={{ mt: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                color: '#2B9CAE',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2B9CAE',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
        
        {renderTabContent()}
      </Box>
    </Container>
  );
};

export { AdvancedComponentLibrary };
export default AdvancedComponentLibrary;
