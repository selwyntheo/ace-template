import React, { useState } from 'react';
import {
  Menu as MuiMenu,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Paper,
  Popper,
  ClickAwayListener,
  Grow,
  Typography,
  Box
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  MoreHoriz as MoreHorizIcon,
  KeyboardArrowDown,
  Check
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(1),
    minWidth: 180,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  '& .MuiMenuItem-root': {
    padding: theme.spacing(1, 2),
    '&:hover': {
      backgroundColor: 'rgba(43, 156, 174, 0.04)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(43, 156, 174, 0.08)',
      '&:hover': {
        backgroundColor: 'rgba(43, 156, 174, 0.12)',
      },
    },
  },
}));

// Basic Menu Component
export const Menu = ({
  anchorEl,
  open,
  onClose,
  items = [],
  transformOrigin = { horizontal: 'right', vertical: 'top' },
  anchorOrigin = { horizontal: 'right', vertical: 'bottom' },
  className = '',
  ...props
}) => (
  <StyledMenu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    transformOrigin={transformOrigin}
    anchorOrigin={anchorOrigin}
    className={className}
    {...props}
  >
    {items.map((item, index) => {
      if (item.divider) {
        return <Divider key={`divider-${index}`} />;
      }
      
      return (
        <MenuItem
          key={item.id || index}
          onClick={() => {
            item.onClick?.();
            onClose?.();
          }}
          disabled={item.disabled}
          selected={item.selected}
        >
          {item.icon && (
            <ListItemIcon sx={{ color: item.color || 'inherit' }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText 
            primary={item.label}
            secondary={item.description}
            sx={{ color: item.color || 'inherit' }}
          />
          {item.shortcut && (
            <Typography variant="caption" sx={{ ml: 2, opacity: 0.6 }}>
              {item.shortcut}
            </Typography>
          )}
        </MenuItem>
      );
    })}
  </StyledMenu>
);

// Context Menu Component
export const ContextMenu = ({
  children,
  menuItems = [],
  disabled = false,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleContextMenu = (event) => {
    if (disabled) return;
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box onContextMenu={handleContextMenu} sx={{ cursor: 'context-menu' }}>
        {children}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={menuItems}
        {...props}
      />
    </>
  );
};

// Dropdown Menu with Button
export const DropdownMenu = ({
  trigger,
  triggerIcon = <KeyboardArrowDown />,
  items = [],
  triggerProps = {},
  disabled = false,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        disabled={disabled}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '8px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            backgroundColor: disabled ? 'white' : '#f5f5f5',
          },
          ...triggerProps.sx,
        }}
        {...triggerProps}
      >
        {trigger}
        {triggerIcon}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={items}
        {...props}
      />
    </>
  );
};

// Action Menu (Three dots menu)
export const ActionMenu = ({
  items = [],
  iconButton = <MoreVertIcon />,
  direction = 'vertical',
  size = 'medium',
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const icon = direction === 'horizontal' ? <MoreHorizIcon /> : iconButton;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={size}
        sx={{
          color: '#666666',
          '&:hover': {
            backgroundColor: 'rgba(43, 156, 174, 0.04)',
            color: '#2B9CAE',
          },
        }}
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={items}
        {...props}
      />
    </>
  );
};

// Select Menu (single selection)
export const SelectMenu = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const selectedOption = options.find(option => option.value === value);

  const handleClick = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    onChange?.(option.value);
    handleClose();
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        disabled={disabled}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          textAlign: 'left',
          '&:hover': {
            borderColor: disabled ? '#e0e0e0' : '#2B9CAE',
          },
        }}
      >
        <Typography variant="body2" sx={{ color: selectedOption ? 'inherit' : '#999' }}>
          {selectedOption?.label || placeholder}
        </Typography>
        <KeyboardArrowDown sx={{ color: '#666' }} />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        items={options.map(option => ({
          ...option,
          onClick: () => handleSelect(option),
          selected: option.value === value,
          icon: option.value === value ? <Check /> : option.icon,
        }))}
        {...props}
      />
    </>
  );
};

// Nested Menu Component
export const NestedMenu = ({
  anchorEl,
  open,
  onClose,
  items = [],
  ...props
}) => {
  const [subMenuAnchor, setSubMenuAnchor] = useState(null);
  const [subMenuItems, setSubMenuItems] = useState([]);

  const handleSubMenuOpen = (event, subItems) => {
    setSubMenuAnchor(event.currentTarget);
    setSubMenuItems(subItems);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchor(null);
    setSubMenuItems([]);
  };

  return (
    <>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        {...props}
      >
        {items.map((item, index) => {
          if (item.divider) {
            return <Divider key={`divider-${index}`} />;
          }
          
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          
          return (
            <MenuItem
              key={item.id || index}
              onClick={() => {
                if (hasSubmenu) {
                  return;
                }
                item.onClick?.();
                onClose?.();
              }}
              onMouseEnter={hasSubmenu ? (e) => handleSubMenuOpen(e, item.submenu) : undefined}
              disabled={item.disabled}
              selected={item.selected}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: item.color || 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText 
                primary={item.label}
                secondary={item.description}
                sx={{ color: item.color || 'inherit' }}
              />
              {hasSubmenu && (
                <Typography sx={{ ml: 2 }}>▶</Typography>
              )}
            </MenuItem>
          );
        })}
      </StyledMenu>
      
      {/* Submenu */}
      {subMenuAnchor && (
        <StyledMenu
          anchorEl={subMenuAnchor}
          open={Boolean(subMenuAnchor)}
          onClose={handleSubMenuClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {subMenuItems.map((item, index) => (
            <MenuItem
              key={item.id || index}
              onClick={() => {
                item.onClick?.();
                handleSubMenuClose();
                onClose?.();
              }}
              disabled={item.disabled}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: item.color || 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </>
  );
};

export default Menu;
