import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  RadioGroup as MuiRadioGroup,
  Radio as MuiRadio,
  Checkbox as MuiCheckbox,
  Switch as MuiSwitch,
  FormGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiFormLabel-root': {
    color: '#2c3e50',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    '&.Mui-focused': {
      color: '#2B9CAE',
    },
  },
}));

const StyledRadio = styled(MuiRadio)(({ theme }) => ({
  color: '#bdc3c7',
  '&.Mui-checked': {
    color: '#2B9CAE',
  },
}));

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  color: '#bdc3c7',
  '&.Mui-checked': {
    color: '#2B9CAE',
  },
}));

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#2B9CAE',
    '& + .MuiSwitch-track': {
      backgroundColor: '#2B9CAE',
    },
  },
}));

// Radio Group Component
export const RadioGroup = ({
  label,
  value,
  onChange,
  options = [],
  row = false,
  required = false,
  error = false,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => (
  <StyledFormControl
    component="fieldset"
    error={error}
    required={required}
    disabled={disabled}
    className={className}
    {...props}
  >
    {label && <FormLabel component="legend">{label}</FormLabel>}
    <MuiRadioGroup
      value={value}
      onChange={onChange}
      row={row}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<StyledRadio />}
          label={option.label}
          disabled={option.disabled || disabled}
        />
      ))}
    </MuiRadioGroup>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

// Single Radio Component
export const Radio = ({
  checked,
  onChange,
  value,
  label,
  disabled = false,
  ...props
}) => (
  <FormControlLabel
    control={
      <StyledRadio
        checked={checked}
        onChange={onChange}
        value={value}
        disabled={disabled}
        {...props}
      />
    }
    label={label}
    disabled={disabled}
  />
);

// Checkbox Group Component
export const CheckboxGroup = ({
  label,
  value = [],
  onChange,
  options = [],
  row = false,
  required = false,
  error = false,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleChange = (optionValue) => (event) => {
    if (event.target.checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <StyledFormControl
      component="fieldset"
      error={error}
      required={required}
      disabled={disabled}
      className={className}
      {...props}
    >
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <StyledCheckbox
                checked={value.includes(option.value)}
                onChange={handleChange(option.value)}
                disabled={option.disabled || disabled}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

// Single Checkbox Component
export const Checkbox = ({
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  error = false,
  helperText,
  ...props
}) => (
  <StyledFormControl error={error} disabled={disabled}>
    <FormControlLabel
      control={
        <StyledCheckbox
          checked={checked}
          onChange={onChange}
          indeterminate={indeterminate}
          disabled={disabled}
          {...props}
        />
      }
      label={label}
      disabled={disabled}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

// Switch Component
export const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  color = 'primary',
  size = 'medium',
  labelPlacement = 'end',
  ...props
}) => (
  <FormControlLabel
    control={
      <StyledSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        color={color}
        size={size}
        {...props}
      />
    }
    label={label}
    labelPlacement={labelPlacement}
    disabled={disabled}
  />
);

// Toggle Button (alternative switch style)
export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  ...props
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    }}
    onClick={disabled ? undefined : () => onChange({ target: { checked: !checked } })}
  >
    <div
      style={{
        width: size === 'small' ? '32px' : '48px',
        height: size === 'small' ? '18px' : '24px',
        borderRadius: '12px',
        backgroundColor: checked ? '#2B9CAE' : '#e0e0e0',
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div
        style={{
          width: size === 'small' ? '14px' : '20px',
          height: size === 'small' ? '14px' : '20px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: '2px',
          left: checked ? (size === 'small' ? '16px' : '26px') : '2px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
    {label && (
      <span style={{ fontSize: '14px', color: '#2c3e50' }}>
        {label}
      </span>
    )}
  </div>
);

// Form Field Wrapper
export const FormField = ({
  label,
  required = false,
  error = false,
  helperText,
  children,
  className = '',
  ...props
}) => (
  <StyledFormControl
    error={error}
    required={required}
    className={className}
    {...props}
  >
    {label && <FormLabel>{label}</FormLabel>}
    {children}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

export default RadioGroup;
