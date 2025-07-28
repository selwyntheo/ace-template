import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Snackbar,
  Slide
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '& .MuiAlert-icon': {
    alignItems: 'center',
  },
  '& .MuiAlert-message': {
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  
  '&.MuiAlert-standardSuccess': {
    backgroundColor: '#d4edda',
    color: '#155724',
    '& .MuiAlert-icon': {
      color: '#28a745',
    },
  },
  
  '&.MuiAlert-standardError': {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    '& .MuiAlert-icon': {
      color: '#dc3545',
    },
  },
  
  '&.MuiAlert-standardWarning': {
    backgroundColor: '#fff3cd',
    color: '#856404',
    '& .MuiAlert-icon': {
      color: '#ffc107',
    },
  },
  
  '&.MuiAlert-standardInfo': {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    '& .MuiAlert-icon': {
      color: '#17a2b8',
    },
  },
}));

const Alert = ({
  severity = 'info',
  variant = 'standard',
  title,
  children,
  onClose,
  closable = false,
  className = '',
  style = {},
  ...props
}) => (
  <StyledAlert
    severity={severity}
    variant={variant}
    onClose={closable ? onClose : undefined}
    className={className}
    style={style}
    {...props}
  >
    {title && <AlertTitle>{title}</AlertTitle>}
    {children}
  </StyledAlert>
);

// Toast notification component
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export const Toast = ({
  open = false,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  ...props
}) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    TransitionComponent={SlideTransition}
    {...props}
  >
    <StyledAlert severity={severity} onClose={onClose}>
      {message}
    </StyledAlert>
  </Snackbar>
);

// Specialized alert variants
export const SuccessAlert = (props) => (
  <Alert severity="success" {...props} />
);

export const ErrorAlert = (props) => (
  <Alert severity="error" {...props} />
);

export const WarningAlert = (props) => (
  <Alert severity="warning" {...props} />
);

export const InfoAlert = (props) => (
  <Alert severity="info" {...props} />
);

// Inline alerts
export const InlineAlert = ({ 
  type = 'info', 
  message, 
  title,
  closable = true,
  onClose,
  ...props 
}) => {
  const severityMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    danger: 'error'
  };

  return (
    <Alert
      severity={severityMap[type] || 'info'}
      title={title}
      closable={closable}
      onClose={onClose}
      {...props}
    >
      {message}
    </Alert>
  );
};

// Banner alert (full width)
export const BannerAlert = ({ 
  type = 'info', 
  message, 
  title,
  action,
  ...props 
}) => (
  <Alert
    severity={type}
    title={title}
    variant="filled"
    style={{ 
      width: '100%', 
      borderRadius: 0,
      marginBottom: '16px'
    }}
    action={action}
    {...props}
  >
    {message}
  </Alert>
);

export default Alert;
