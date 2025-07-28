import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  IconButton,
  Popper,
  ClickAwayListener
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledSearchBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  border: '1px solid #e0e0e0',
  backgroundColor: '#fafafa',
}));

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    backgroundColor: 'white',
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
}));

// Basic Search Box
export const SearchBox = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  disabled = false,
  autoFocus = false,
  showClearButton = true,
  fullWidth = true,
  size = 'medium',
  className = '',
  ...props
}) => {
  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onSearch?.('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <StyledSearchInput
      value={value || ''}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      size={size}
      className={className}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#2B9CAE' }} />
          </InputAdornment>
        ),
        endAdornment: showClearButton && value && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={disabled}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

// Advanced Search with Filters
export const AdvancedSearchBox = ({
  value,
  onChange,
  onSearch,
  filters = [],
  activeFilters = [],
  onFilterChange,
  placeholder = 'Search...',
  disabled = false,
  showFilterButton = true,
  className = '',
  ...props
}) => {
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState(value || '');

  const handleSearchChange = (event) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    onChange?.({ target: { value: newValue } });
  };

  const handleSearch = () => {
    onSearch?.(searchValue, activeFilters);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(filterAnchor ? null : event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterToggle = (filter) => {
    const isActive = activeFilters.some(af => af.id === filter.id);
    if (isActive) {
      onFilterChange?.(activeFilters.filter(af => af.id !== filter.id));
    } else {
      onFilterChange?.([...activeFilters, filter]);
    }
  };

  const handleRemoveFilter = (filterId) => {
    onFilterChange?.(activeFilters.filter(af => af.id !== filterId));
  };

  return (
    <StyledSearchBox className={className}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StyledSearchInput
          value={searchValue}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#2B9CAE' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue('');
                    onChange?.({ target: { value: '' } });
                  }}
                  disabled={disabled}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...props}
        />
        
        {showFilterButton && filters.length > 0 && (
          <IconButton
            onClick={handleFilterClick}
            sx={{ 
              border: '1px solid #e0e0e0',
              backgroundColor: activeFilters.length > 0 ? '#2B9CAE' : 'white',
              color: activeFilters.length > 0 ? 'white' : '#2B9CAE',
              '&:hover': {
                backgroundColor: activeFilters.length > 0 ? '#247a89' : '#f5f5f5',
              }
            }}
          >
            <FilterIcon />
          </IconButton>
        )}
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {activeFilters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              size="small"
              onDelete={() => handleRemoveFilter(filter.id)}
              sx={{ backgroundColor: '#2B9CAE', color: 'white' }}
            />
          ))}
        </Box>
      )}

      {/* Filter Dropdown */}
      <Popper open={Boolean(filterAnchor)} anchorEl={filterAnchor} placement="bottom-start">
        <ClickAwayListener onClickAway={handleFilterClose}>
          <Paper sx={{ p: 1, border: '1px solid #e0e0e0', maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ p: 1, fontWeight: 600 }}>
              Filters
            </Typography>
            <List dense>
              {filters.map((filter) => {
                const isActive = activeFilters.some(af => af.id === filter.id);
                return (
                  <ListItem
                    key={filter.id}
                    button
                    onClick={() => handleFilterToggle(filter)}
                    sx={{
                      backgroundColor: isActive ? 'rgba(43, 156, 174, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive ? 'rgba(43, 156, 174, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    {filter.icon && (
                      <ListItemIcon sx={{ color: isActive ? '#2B9CAE' : 'inherit' }}>
                        {filter.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText 
                      primary={filter.label}
                      secondary={filter.description}
                      sx={{ color: isActive ? '#2B9CAE' : 'inherit' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </StyledSearchBox>
  );
};

// Search with Suggestions
export const SearchWithSuggestions = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  onSuggestionClick,
  placeholder = 'Search...',
  disabled = false,
  showSuggestions = true,
  maxSuggestions = 5,
  className = '',
  ...props
}) => {
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    onChange?.(event);
    
    if (showSuggestions && newValue) {
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(newValue.toLowerCase())
        )
        .slice(0, maxSuggestions);
      setFilteredSuggestions(filtered);
      setShowSuggestionsList(filtered.length > 0);
    } else {
      setShowSuggestionsList(false);
    }
  }, [onChange, suggestions, showSuggestions, maxSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    onChange?.({ target: { value: suggestion } });
    onSuggestionClick?.(suggestion);
    setShowSuggestionsList(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch?.(value);
      setShowSuggestionsList(false);
    }
  };

  return (
    <Box sx={{ position: 'relative' }} className={className}>
      <SearchBox
        value={value}
        onChange={handleChange}
        onSearch={onSearch}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      
      {showSuggestionsList && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 0.5,
            border: '1px solid #e0e0e0',
            maxHeight: 200,
            overflow: 'auto',
          }}
        >
          <List dense>
            {filteredSuggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(43, 156, 174, 0.04)',
                  }
                }}
              >
                <ListItemIcon>
                  <SearchIcon sx={{ color: '#2B9CAE', fontSize: '1rem' }} />
                </ListItemIcon>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

// Global Search Component
export const GlobalSearch = ({
  value,
  onChange,
  onSearch,
  categories = [],
  recentSearches = [],
  onClearRecent,
  placeholder = 'Search everywhere...',
  className = '',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box className={className}>
      <SearchBox
        value={value}
        onChange={onChange}
        onSearch={onSearch}
        placeholder={placeholder}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
        {...props}
      />
      
      {isExpanded && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: 0.5,
            border: '1px solid #e0e0e0',
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          {recentSearches.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Recent Searches
                </Typography>
                <IconButton size="small" onClick={onClearRecent}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    size="small"
                    onClick={() => onChange?.({ target: { value: search } })}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {categories.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Search in Categories
              </Typography>
              <List dense>
                {categories.map((category) => (
                  <ListItem
                    key={category.id}
                    button
                    onClick={() => category.onClick?.()}
                  >
                    {category.icon && (
                      <ListItemIcon>
                        {category.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText 
                      primary={category.label}
                      secondary={category.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBox;
