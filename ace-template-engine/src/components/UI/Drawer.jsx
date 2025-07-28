import React from 'react';
import {
  Drawer as MuiDrawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const StyledDrawer = styled(MuiDrawer)(({ theme, variant, anchor }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme, open }) => ({
  backgroundColor: '#2B9CAE',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Main = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

// Basic Drawer Component
export const Drawer = ({
  open = false,
  onClose,
  anchor = 'left',
  variant = 'temporary',
  children,
  width = drawerWidth,
  className = '',
  ...props
}) => (
  <StyledDrawer
    anchor={anchor}
    open={open}
    onClose={onClose}
    variant={variant}
    className={className}
    sx={{
      '& .MuiDrawer-paper': {
        width: width,
      },
    }}
    {...props}
  >
    {children}
  </StyledDrawer>
);

// Navigation Drawer with Header
export const NavigationDrawer = ({
  open = false,
  onClose,
  title,
  menuItems = [],
  selectedItem,
  onItemClick,
  variant = 'temporary',
  showDividers = true,
  className = '',
  ...props
}) => {
  const [expandedItems, setExpandedItems] = React.useState({});

  const handleExpandClick = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isSelected = selectedItem === item.id;

    return (
      <React.Fragment key={item.id}>
        <ListItemButton
          selected={isSelected}
          onClick={() => {
            if (hasChildren) {
              handleExpandClick(item.id);
            } else {
              onItemClick?.(item);
            }
          }}
          sx={{
            pl: 2 + level * 2,
            '&.Mui-selected': {
              backgroundColor: 'rgba(43, 156, 174, 0.1)',
              borderRight: '3px solid #2B9CAE',
            },
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ color: isSelected ? '#2B9CAE' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText 
            primary={item.label}
            sx={{ 
              color: isSelected ? '#2B9CAE' : 'inherit',
              '& .MuiTypography-root': {
                fontWeight: isSelected ? 600 : 400,
              }
            }}
          />
          {hasChildren && (
            <IconButton size="small">
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItemButton>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
        
        {showDividers && item.divider && <Divider />}
      </React.Fragment>
    );
  };

  return (
    <StyledDrawer
      open={open}
      onClose={onClose}
      variant={variant}
      className={className}
      {...props}
    >
      {title && (
        <>
          <Box sx={{ p: 2, backgroundColor: '#2B9CAE', color: 'white' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
          <Divider />
        </>
      )}
      
      <List sx={{ pt: 0 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </StyledDrawer>
  );
};

// Sidebar Layout Component
export const SidebarLayout = ({
  children,
  sidebarContent,
  sidebarOpen = false,
  onSidebarToggle,
  appBarTitle,
  appBarActions,
  drawerVariant = 'persistent',
  className = '',
  ...props
}) => {
  return (
    <Box sx={{ display: 'flex' }} className={className} {...props}>
      <StyledAppBar position="fixed" open={sidebarOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={onSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {appBarTitle}
          </Typography>
          {appBarActions}
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant={drawerVariant}
        open={sidebarOpen}
        onClose={onSidebarToggle}
      >
        <Toolbar>
          <IconButton onClick={onSidebarToggle}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        {sidebarContent}
      </StyledDrawer>

      <Main open={sidebarOpen}>
        <Toolbar />
        {children}
      </Main>
    </Box>
  );
};

// Mini Drawer Variant
export const MiniDrawer = ({
  open = false,
  onToggle,
  menuItems = [],
  selectedItem,
  onItemClick,
  className = '',
  ...props
}) => {
  const miniDrawerWidth = 72;

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      className={className}
      sx={{
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          overflowX: 'hidden',
          transition: 'width 0.2s ease-in-out',
        },
      }}
      {...props}
    >
      <Toolbar>
        <IconButton onClick={onToggle} sx={{ ml: 'auto' }}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Toolbar>
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedItem === item.id}
              onClick={() => onItemClick?.(item)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(43, 156, 174, 0.1)',
                  borderRight: '3px solid #2B9CAE',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: selectedItem === item.id ? '#2B9CAE' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: selectedItem === item.id ? '#2B9CAE' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

// Right-side Panel
export const RightPanel = ({
  open = false,
  onClose,
  title,
  children,
  width = 400,
  className = '',
  ...props
}) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    variant="temporary"
    width={width}
    className={className}
    {...props}
  >
    {title && (
      <>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#2B9CAE', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton color="inherit" onClick={onClose} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
        <Divider />
      </>
    )}
    <Box sx={{ p: 2 }}>
      {children}
    </Box>
  </Drawer>
);

export default Drawer;
