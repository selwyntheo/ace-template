import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  fontWeight: 500,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: size === 'small' ? theme.spacing(0.5, 1.5) : 
           size === 'large' ? theme.spacing(1.5, 3) : 
           theme.spacing(1, 2),
  fontSize: size === 'small' ? '0.875rem' : 
           size === 'large' ? '1rem' : 
           '0.875rem',
  minWidth: size === 'small' ? 'auto' : '64px',
  
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#2B9CAE',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#247a89',
    },
    '&:disabled': {
      backgroundColor: '#e0e0e0',
      color: '#bdbdbd',
    },
  },
  
  '&.MuiButton-containedSecondary': {
    backgroundColor: '#f5f5f5',
    color: '#333333',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#eeeeee',
    },
    '&:disabled': {
      backgroundColor: '#f9f9f9',
      color: '#bdbdbd',
    },
  },
  
  '&.MuiButton-outlinedPrimary': {
    borderColor: '#2B9CAE',
    color: '#2B9CAE',
    '&:hover': {
      borderColor: '#247a89',
      backgroundColor: 'rgba(43, 156, 174, 0.04)',
    },
  },
  
  '&.MuiButton-text': {
    color: '#2B9CAE',
    '&:hover': {
      backgroundColor: 'rgba(43, 156, 174, 0.04)',
    },
  },
  
  '&.btn-danger': {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
  
  '&.btn-warning': {
    backgroundColor: '#ffc107',
    color: '#212529',
    '&:hover': {
      backgroundColor: '#e0a800',
    },
  },
  
  '&.btn-success': {
    backgroundColor: '#28a745',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
}));

const Button = ({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  style = {},
  ...props 
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={!loading ? endIcon : undefined}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

// Specialized button variants
export const ButtonSolid = ({ variant = 'primary', ...props }) => {
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'inherit',
    danger: 'error',
    warning: 'warning',
    success: 'success',
  };
  
  return (
    <Button
      variant="contained"
      color={colorMap[variant] || 'primary'}
      className={variant === 'danger' ? 'btn-danger' : 
                variant === 'warning' ? 'btn-warning' :
                variant === 'success' ? 'btn-success' : ''}
      {...props}
    />
  );
};

export const ButtonOutline = ({ variant = 'primary', ...props }) => {
  return (
    <Button
      variant="outlined"
      color={variant === 'primary' ? 'primary' : 'inherit'}
      {...props}
    />
  );
};

export const ButtonText = ({ variant = 'primary', ...props }) => {
  return (
    <Button
      variant="text"
      color={variant === 'primary' ? 'primary' : 'inherit'}
      {...props}
    />
  );
};

export const IconButton = ({ icon, ...props }) => {
  return (
    <Button
      variant="text"
      size="small"
      style={{ minWidth: '32px', padding: '8px' }}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button;
