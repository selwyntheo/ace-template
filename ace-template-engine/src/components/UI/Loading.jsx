import React from 'react';
import {
  CircularProgress as MuiCircularProgress,
  LinearProgress as MuiLinearProgress,
  Box,
  Typography,
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCircularProgress = styled(MuiCircularProgress)(({ theme }) => ({
  color: '#2B9CAE',
}));

const StyledLinearProgress = styled(MuiLinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#2B9CAE',
    borderRadius: 4,
  },
}));

// Circular Progress/Spinner
export const Spinner = ({
  size = 40,
  thickness = 3.6,
  color = 'primary',
  className = '',
  ...props
}) => (
  <StyledCircularProgress
    size={size}
    thickness={thickness}
    className={className}
    {...props}
  />
);

// Linear Progress Bar
export const ProgressBar = ({
  value,
  variant = 'determinate',
  showLabel = false,
  label,
  className = '',
  style = {},
  ...props
}) => (
  <Box sx={{ width: '100%', ...style }} className={className}>
    <StyledLinearProgress
      variant={variant}
      value={value}
      {...props}
    />
    {showLabel && (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label || `${Math.round(value || 0)}%`}
        </Typography>
        {value !== undefined && (
          <Typography variant="caption" color="text.secondary">
            {`${Math.round(value)}%`}
          </Typography>
        )}
      </Box>
    )}
  </Box>
);

// Loading overlay with spinner
export const LoadingOverlay = ({
  open = false,
  message = 'Loading...',
  size = 60,
  backdrop = true,
  ...props
}) => {
  if (backdrop) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={open}
        {...props}
      >
        <Spinner size={size} style={{ color: '#ffffff' }} />
        {message && (
          <Typography variant="h6" color="inherit">
            {message}
          </Typography>
        )}
      </Backdrop>
    );
  }

  return open ? (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
        gap: 2
      }}
      {...props}
    >
      <Spinner size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  ) : null;
};

// Inline loading component
export const InlineLoader = ({
  size = 20,
  message,
  direction = 'row',
  className = '',
  ...props
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      flexDirection: direction === 'column' ? 'column' : 'row'
    }}
    className={className}
    {...props}
  >
    <Spinner size={size} />
    {message && (
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

// Page loading component
export const PageLoader = ({
  message = 'Loading page...',
  fullScreen = false,
  ...props
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: fullScreen ? '100vh' : '200px',
      gap: 2
    }}
    {...props}
  >
    <Spinner size={60} />
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Button loading state
export const ButtonLoader = ({
  size = 16,
  color = 'inherit',
  ...props
}) => (
  <Spinner
    size={size}
    style={{ color }}
    {...props}
  />
);

// Skeleton loader placeholder
export const SkeletonLoader = ({
  width = '100%',
  height = 20,
  variant = 'rectangular',
  className = '',
  ...props
}) => (
  <Box
    sx={{
      width,
      height,
      backgroundColor: '#f0f0f0',
      borderRadius: variant === 'circular' ? '50%' : '4px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.5,
        },
      },
    }}
    className={className}
    {...props}
  />
);

// Progress with steps
export const StepProgress = ({
  steps = [],
  activeStep = 0,
  className = '',
  ...props
}) => (
  <Box sx={{ width: '100%' }} className={className} {...props}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: index <= activeStep ? '#2B9CAE' : '#e0e0e0',
              color: index <= activeStep ? '#ffffff' : '#757575',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {index + 1}
          </Box>
          {index < steps.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: 2,
                backgroundColor: index < activeStep ? '#2B9CAE' : '#e0e0e0',
                mx: 1,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
    <Typography variant="caption" color="text.secondary">
      Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
    </Typography>
  </Box>
);

export default Spinner;
