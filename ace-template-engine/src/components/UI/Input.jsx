import React, { useState, forwardRef } from 'react';
import { 
  TextField as MuiTextField, 
  InputAdornment, 
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ContentCopy,
  Check
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#2B9CAE',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2B9CAE',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#2B9CAE',
    },
  },
}));

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error = false,
  helperText,
  fullWidth = true,
  multiline = false,
  rows = 1,
  maxRows,
  variant = 'outlined',
  size = 'medium',
  autoComplete,
  autoFocus = false,
  name,
  id,
  className = '',
  style = {},
  startIcon,
  endIcon,
  encrypted = false,
  copyToClipboard = false,
  workspaceVariables,
  workspaceConstants,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyToClipboard = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const isPasswordType = type === 'password' || encrypted;
  const isCopyType = type === 'copyToClipboard' || copyToClipboard;
  const actualType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const endAdornment = [];

  if (isPasswordType) {
    endAdornment.push(
      <IconButton
        key="password-toggle"
        aria-label="toggle password visibility"
        onClick={handleTogglePassword}
        disabled={disabled}
        edge="end"
        size="small"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    );
  }

  if (isCopyType && value) {
    endAdornment.push(
      <IconButton
        key="copy-button"
        aria-label="copy to clipboard"
        onClick={handleCopyToClipboard}
        disabled={disabled}
        edge="end"
        size="small"
        color={isCopied ? 'success' : 'default'}
      >
        {isCopied ? <Check /> : <ContentCopy />}
      </IconButton>
    );
  }

  if (endIcon) {
    endAdornment.push(endIcon);
  }

  const inputProps = {
    type: actualType,
    value: value || '',
    onChange,
    onBlur: (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    onFocus: (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    disabled,
    required,
    autoComplete,
    autoFocus,
    name,
    id,
    placeholder,
    multiline,
    rows: multiline ? rows : undefined,
    maxRows: multiline ? maxRows : undefined,
    ref,
    startAdornment: startIcon ? (
      <InputAdornment position="start">{startIcon}</InputAdornment>
    ) : undefined,
    endAdornment: endAdornment.length > 0 ? (
      <InputAdornment position="end">
        {endAdornment}
      </InputAdornment>
    ) : undefined,
    ...props
  };

  return (
    <div className={`tj-app-input ${className}`} style={style}>
      <StyledTextField
        label={label}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        error={error}
        helperText={helperText}
        {...inputProps}
      />
      
      {/* Workspace Variables Preview */}
      {(workspaceVariables || workspaceConstants) && isFocused && (
        <div className="workspace-variables-preview">
          {/* Add workspace variables preview component here */}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Specialized input variants
export const PasswordInput = (props) => (
  <Input type="password" {...props} />
);

export const EmailInput = (props) => (
  <Input type="email" autoComplete="email" {...props} />
);

export const SearchInput = (props) => (
  <Input 
    type="search" 
    placeholder="Search..." 
    {...props} 
  />
);

export const CopyableInput = (props) => (
  <Input copyToClipboard {...props} />
);

export const TextArea = (props) => (
  <Input multiline rows={4} {...props} />
);

export default Input;
