import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Breadcrumbs,
  Link,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Logout,
  NavigateNext,
  Home
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: '#2B9CAE',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '64px',
  padding: '0 16px',
});

// Basic Header Component
export const Header = ({
  title,
  subtitle,
  logo,
  leftActions,
  rightActions,
  children,
  position = 'static',
  elevation = 1,
  className = '',
  ...props
}) => (
  <StyledAppBar 
    position={position} 
    elevation={elevation}
    className={className}
    {...props}
  >
    <StyledToolbar>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {logo}
        {leftActions}
        <Box>
          {title && (
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {rightActions}
        {children}
      </Box>
    </StyledToolbar>
  </StyledAppBar>
);

// Navigation Header with Menu
export const NavigationHeader = ({
  title,
  logo,
  menuItems = [],
  userMenuItems = [],
  userName,
  userAvatar,
  onMenuClick,
  onUserMenuClick,
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  className = '',
  ...props
}) => {
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuItemClick = (item) => {
    onUserMenuClick?.(item);
    handleUserMenuClose();
  };

  return (
    <>
      <StyledAppBar position="static" className={className} {...props}>
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {onMenuClick && (
              <IconButton color="inherit" onClick={onMenuClick}>
                <MenuIcon />
              </IconButton>
            )}
            {logo}
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Main Navigation Menu */}
            {menuItems.map((item) => (
              <Button 
                key={item.id}
                color="inherit" 
                onClick={() => item.onClick?.()}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                {item.label}
              </Button>
            ))}

            {/* Notifications */}
            {showNotifications && (
              <IconButton color="inherit" onClick={onNotificationClick}>
                <Box sx={{ position: 'relative' }}>
                  <NotificationsIcon />
                  {notificationCount > 0 && (
                    <Chip
                      label={notificationCount > 99 ? '99+' : notificationCount}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        height: 18,
                        minWidth: 18,
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Box>
              </IconButton>
            )}

            {/* User Menu */}
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              {userAvatar ? (
                <Avatar src={userAvatar} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userName && (
          <>
            <MenuItem disabled>
              <ListItemText primary={userName} />
            </MenuItem>
            <Divider />
          </>
        )}
        {userMenuItems.map((item, index) => (
          <MenuItem 
            key={item.id || index}
            onClick={() => handleUserMenuItemClick(item)}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Page Header with Breadcrumbs
export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  backButton,
  className = '',
  ...props
}) => (
  <Box 
    sx={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #e0e0e0',
      p: 3
    }}
    className={className}
    {...props}
  >
    {breadcrumbs.length > 0 && (
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 2 }}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <Link
            key={index}
            color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
            href={breadcrumb.href}
            onClick={breadcrumb.onClick}
            sx={{ 
              cursor: breadcrumb.href || breadcrumb.onClick ? 'pointer' : 'default',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: breadcrumb.href || breadcrumb.onClick ? 'underline' : 'none',
              }
            }}
          >
            {breadcrumb.icon && <Box component="span" sx={{ mr: 0.5, display: 'inline-flex' }}>{breadcrumb.icon}</Box>}
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    )}
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {backButton}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5, color: '#2c3e50' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      {actions && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {actions}
        </Box>
      )}
    </Box>
  </Box>
);

// Simple App Bar
export const AppBar = ({
  title,
  leftIcon,
  rightActions,
  onLeftIconClick,
  backgroundColor = '#2B9CAE',
  color = 'white',
  className = '',
  ...props
}) => (
  <MuiAppBar 
    position="static" 
    sx={{ backgroundColor, color }}
    className={className}
    {...props}
  >
    <Toolbar>
      {leftIcon && (
        <IconButton 
          color="inherit" 
          onClick={onLeftIconClick}
          sx={{ mr: 2 }}
        >
          {leftIcon}
        </IconButton>
      )}
      
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      
      {rightActions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {rightActions}
        </Box>
      )}
    </Toolbar>
  </MuiAppBar>
);

// Status Header (for showing current status/mode)
export const StatusHeader = ({
  status,
  statusColor = 'success',
  title,
  message,
  actions,
  onClose,
  className = '',
  ...props
}) => (
  <Box
    sx={{
      backgroundColor: statusColor === 'success' ? '#d4edda' : 
                    statusColor === 'warning' ? '#fff3cd' :
                    statusColor === 'error' ? '#f8d7da' : '#d1ecf1',
      color: statusColor === 'success' ? '#155724' : 
             statusColor === 'warning' ? '#856404' :
             statusColor === 'error' ? '#721c24' : '#0c5460',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
    }}
    className={className}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip 
        label={status} 
        size="small"
        sx={{ 
          backgroundColor: 'rgba(0,0,0,0.1)',
          color: 'inherit',
          fontWeight: 600,
        }}
      />
      {title && (
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography variant="body2">
          {message}
        </Typography>
      )}
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {actions}
      {onClose && (
        <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
          ×
        </IconButton>
      )}
    </Box>
  </Box>
);

export default Header;
