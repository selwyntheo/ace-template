import React from 'react';
import {
  Pagination as MuiPagination,
  PaginationItem,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    '&.Mui-selected': {
      backgroundColor: '#2B9CAE',
      color: 'white',
      '&:hover': {
        backgroundColor: '#247a89',
      },
    },
  },
}));

// Basic Pagination Component
export const Pagination = ({
  count,
  page = 1,
  onChange,
  variant = 'outlined',
  shape = 'rounded',
  color = 'primary',
  size = 'medium',
  showFirstButton = true,
  showLastButton = true,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  className = '',
  ...props
}) => (
  <StyledPagination
    count={count}
    page={page}
    onChange={onChange}
    variant={variant}
    shape={shape}
    color={color}
    size={size}
    showFirstButton={showFirstButton}
    showLastButton={showLastButton}
    siblingCount={siblingCount}
    boundaryCount={boundaryCount}
    disabled={disabled}
    className={className}
    renderItem={(item) => (
      <PaginationItem
        components={{
          first: FirstPage,
          last: LastPage,
          previous: NavigateBefore,
          next: NavigateNext,
        }}
        {...item}
      />
    )}
    {...props}
  />
);

// Table Pagination with rows per page
export const TablePaginationComponent = ({
  count,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  labelRowsPerPage = 'Rows per page:',
  labelDisplayedRows = ({ from, to, count }) => `${from}-${to} of ${count}`,
  showFirstButton = true,
  showLastButton = true,
  component = 'div',
  className = '',
  ...props
}) => (
  <TablePagination
    component={component}
    count={count}
    page={page}
    rowsPerPage={rowsPerPage}
    onPageChange={onPageChange}
    onRowsPerPageChange={onRowsPerPageChange}
    rowsPerPageOptions={rowsPerPageOptions}
    labelRowsPerPage={labelRowsPerPage}
    labelDisplayedRows={labelDisplayedRows}
    showFirstButton={showFirstButton}
    showLastButton={showLastButton}
    className={className}
    sx={{
      '& .MuiTablePagination-toolbar': {
        minHeight: 52,
      },
      '& .MuiTablePagination-selectLabel': {
        fontSize: '0.875rem',
        color: '#2c3e50',
      },
      '& .MuiTablePagination-displayedRows': {
        fontSize: '0.875rem',
        color: '#2c3e50',
      },
      '& .MuiIconButton-root': {
        color: '#2B9CAE',
        '&.Mui-disabled': {
          color: '#bdbdbd',
        },
      },
    }}
    {...props}
  />
);

// Advanced Pagination with Info
export const AdvancedPagination = ({
  currentPage = 1,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  showInfo = true,
  showItemsPerPage = true,
  className = '',
  ...props
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        p: 2
      }}
      className={className}
    >
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} to {endItem} of {totalItems} entries
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showItemsPerPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Show:
            </Typography>
            <FormControl size="small" variant="outlined">
              <Select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange?.(e.target.value)}
                sx={{ minWidth: 70 }}
              >
                {itemsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => onPageChange?.(page)}
          {...props}
        />
      </Box>
    </Box>
  );
};

// Simple Page Navigation
export const SimplePageNav = ({
  currentPage = 1,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  disabled = false,
  className = '',
  ...props
}) => {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 2,
        p: 2
      }}
      className={className}
      {...props}
    >
      <Box
        component="button"
        onClick={() => {
          onPrevious?.();
          onPageChange?.(currentPage - 1);
        }}
        disabled={!hasPrevious || disabled}
        sx={{
          px: 3,
          py: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: 'white',
          color: '#2B9CAE',
          cursor: hasPrevious && !disabled ? 'pointer' : 'not-allowed',
          opacity: hasPrevious && !disabled ? 1 : 0.5,
          '&:hover': {
            backgroundColor: hasPrevious && !disabled ? '#f5f5f5' : 'white',
          },
        }}
      >
        {previousLabel}
      </Box>
      
      <Typography variant="body2" sx={{ mx: 2 }}>
        Page {currentPage} of {totalPages}
      </Typography>
      
      <Box
        component="button"
        onClick={() => {
          onNext?.();
          onPageChange?.(currentPage + 1);
        }}
        disabled={!hasNext || disabled}
        sx={{
          px: 3,
          py: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          backgroundColor: 'white',
          color: '#2B9CAE',
          cursor: hasNext && !disabled ? 'pointer' : 'not-allowed',
          opacity: hasNext && !disabled ? 1 : 0.5,
          '&:hover': {
            backgroundColor: hasNext && !disabled ? '#f5f5f5' : 'white',
          },
        }}
      >
        {nextLabel}
      </Box>
    </Box>
  );
};

// Load More Button (infinite scroll alternative)
export const LoadMorePagination = ({
  hasMore = false,
  loading = false,
  onLoadMore,
  loadMoreText = 'Load More',
  loadingText = 'Loading...',
  noMoreText = 'No more items',
  totalLoaded,
  totalAvailable,
  className = '',
  ...props
}) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      gap: 2,
      p: 3
    }}
    className={className}
    {...props}
  >
    {totalLoaded && totalAvailable && (
      <Typography variant="body2" color="text.secondary">
        Loaded {totalLoaded} of {totalAvailable} items
      </Typography>
    )}
    
    {hasMore ? (
      <Box
        component="button"
        onClick={onLoadMore}
        disabled={loading}
        sx={{
          px: 4,
          py: 2,
          border: '1px solid #2B9CAE',
          borderRadius: 2,
          backgroundColor: 'white',
          color: '#2B9CAE',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: loading ? 'white' : 'rgba(43, 156, 174, 0.04)',
          },
        }}
      >
        {loading ? loadingText : loadMoreText}
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        {noMoreText}
      </Typography>
    )}
  </Box>
);

export default Pagination;
