import React from 'react';
import {
  Tooltip as MuiTooltip,
  IconButton as MuiIconButton,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    fontSize: '12px',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    maxWidth: '300px',
  },
  '& .MuiTooltip-arrow': {
    color: '#2c3e50',
  },
}));

const StyledIconButton = styled(MuiIconButton)(({ theme, variant, size }) => ({
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  
  ...(variant === 'contained' && {
    backgroundColor: '#2B9CAE',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#247a89',
    },
  }),
  
  ...(variant === 'outlined' && {
    border: '1px solid #2B9CAE',
    color: '#2B9CAE',
    '&:hover': {
      backgroundColor: 'rgba(43, 156, 174, 0.04)',
    },
  }),
  
  ...(size === 'small' && {
    padding: theme.spacing(0.5),
    fontSize: '1rem',
  }),
  
  ...(size === 'large' && {
    padding: theme.spacing(1.5),
    fontSize: '1.5rem',
  }),
}));

// Basic Tooltip Component
export const Tooltip = ({ 
  title, 
  children, 
  placement = 'top',
  arrow = true,
  delay = 0,
  ...props 
}) => (
  <StyledTooltip
    title={title}
    placement={placement}
    arrow={arrow}
    enterDelay={delay}
    {...props}
  >
    {children}
  </StyledTooltip>
);

// Icon Button Component
export const IconButton = ({ 
  children,
  tooltip,
  variant = 'text',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  ...props 
}) => {
  const button = (
    <StyledIconButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </StyledIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

// Floating Action Button
export const FloatingActionButton = ({ 
  children,
  tooltip,
  color = 'primary',
  size = 'large',
  onClick,
  className = '',
  style = {},
  ...props 
}) => {
  const fab = (
    <Fab
      color={color}
      size={size}
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: color === 'primary' ? '#2B9CAE' : undefined,
        '&:hover': {
          backgroundColor: color === 'primary' ? '#247a89' : undefined,
        },
        ...style
      }}
      {...props}
    >
      {children}
    </Fab>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {fab}
      </Tooltip>
    );
  }

  return fab;
};

// Speed Dial Component
export const ActionSpeedDial = ({
  actions = [],
  icon,
  openIcon,
  tooltip,
  direction = 'up',
  open,
  onOpen,
  onClose,
  className = '',
  ...props
}) => (
  <SpeedDial
    ariaLabel={tooltip || 'Actions'}
    icon={<SpeedDialIcon icon={icon} openIcon={openIcon} />}
    direction={direction}
    open={open}
    onOpen={onOpen}
    onClose={onClose}
    className={className}
    sx={{
      '& .MuiSpeedDial-fab': {
        backgroundColor: '#2B9CAE',
        '&:hover': {
          backgroundColor: '#247a89',
        },
      },
    }}
    {...props}
  >
    {actions.map((action) => (
      <SpeedDialAction
        key={action.name}
        icon={action.icon}
        tooltipTitle={action.name}
        onClick={action.onClick}
        sx={{
          '& .MuiSpeedDialAction-fab': {
            backgroundColor: '#f8f9fa',
            color: '#2B9CAE',
            '&:hover': {
              backgroundColor: '#e9ecef',
            },
          },
        }}
      />
    ))}
  </SpeedDial>
);

// Tooltip with custom content
export const RichTooltip = ({
  title,
  content,
  children,
  maxWidth = 300,
  ...props
}) => (
  <StyledTooltip
    title={
      <div style={{ maxWidth }}>
        {title && (
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {title}
          </div>
        )}
        {content}
      </div>
    }
    {...props}
  >
    {children}
  </StyledTooltip>
);

// Help tooltip with question mark icon
export const HelpTooltip = ({ 
  content, 
  title,
  size = 'small',
  ...props 
}) => (
  <Tooltip title={title || content} {...props}>
    <IconButton size={size} style={{ padding: '2px', marginLeft: '4px' }}>
      <span style={{ fontSize: '14px', color: '#95a5a6' }}>?</span>
    </IconButton>
  </Tooltip>
);

export default Tooltip;
