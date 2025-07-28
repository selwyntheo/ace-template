import React, { useState } from 'react';
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Autocomplete,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

// Basic Select Component
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  className = '',
  ...props
}) => (
  <StyledFormControl
    fullWidth={fullWidth}
    size={size}
    variant={variant}
    error={error}
    required={required}
    disabled={disabled}
    className={className}
  >
    {label && <InputLabel>{label}</InputLabel>}
    <MuiSelect
      value={value || ''}
      onChange={onChange}
      label={label}
      displayEmpty={!!placeholder}
      {...props}
    >
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

// Multi-Select Component
export const MultiSelect = ({
  label,
  value = [],
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  showCheckboxes = true,
  chipVariant = 'filled',
  className = '',
  ...props
}) => {
  const handleChange = (event) => {
    const newValue = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    onChange({ target: { value: newValue } });
  };

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      error={error}
      required={required}
      disabled={disabled}
      className={className}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {selected.map((val) => {
              const option = options.find(opt => opt.value === val);
              return (
                <Chip
                  key={val}
                  label={option ? option.label : val}
                  size="small"
                  variant={chipVariant}
                  style={{ backgroundColor: '#2B9CAE', color: 'white' }}
                />
              );
            })}
          </div>
        )}
        displayEmpty={!!placeholder}
        {...props}
      >
        {placeholder && value.length === 0 && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
            {showCheckboxes && (
              <Checkbox 
                checked={value.indexOf(option.value) > -1}
                style={{ color: '#2B9CAE' }}
              />
            )}
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

// Autocomplete/Combobox Component
export const Combobox = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  freeSolo = false,
  multiple = false,
  loading = false,
  noOptionsText = 'No options',
  className = '',
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange({ target: { value: newValue } });
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => option.label || option}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      freeSolo={freeSolo}
      multiple={multiple}
      loading={loading}
      disabled={disabled}
      noOptionsText={noOptionsText}
      fullWidth={fullWidth}
      size={size}
      className={className}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
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
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.label || option}
            {...getTagProps({ index })}
            key={option.value || option}
            size="small"
            style={{ backgroundColor: '#2B9CAE', color: 'white' }}
          />
        ))
      }
      {...props}
    />
  );
};

// Native Select (for better performance with large datasets)
export const NativeSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => (
  <StyledFormControl
    fullWidth={fullWidth}
    error={error}
    required={required}
    disabled={disabled}
    className={className}
  >
    {label && <InputLabel shrink>{label}</InputLabel>}
    <select
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      style={{
        padding: '16.5px 14px',
        borderRadius: '8px',
        border: error ? '2px solid #d32f2f' : '1px solid #e0e0e0',
        fontSize: '16px',
        fontFamily: 'inherit',
        backgroundColor: disabled ? '#f5f5f5' : 'white',
        color: disabled ? '#bdbdbd' : 'inherit',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

// Grouped Select
export const GroupedSelect = ({
  label,
  value,
  onChange,
  groups = [],
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  className = '',
  ...props
}) => (
  <StyledFormControl
    fullWidth={fullWidth}
    size={size}
    error={error}
    required={required}
    disabled={disabled}
    className={className}
  >
    {label && <InputLabel>{label}</InputLabel>}
    <MuiSelect
      value={value || ''}
      onChange={onChange}
      label={label}
      displayEmpty={!!placeholder}
      {...props}
    >
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}
      {groups.map((group) => [
        <MenuItem key={`group-${group.label}`} disabled style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
          {group.label}
        </MenuItem>,
        ...group.options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            style={{ paddingLeft: '32px' }}
          >
            {option.label}
          </MenuItem>
        ))
      ])}
    </MuiSelect>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

export default Select;
