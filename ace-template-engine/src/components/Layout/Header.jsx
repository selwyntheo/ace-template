import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Edit,
  CollectionsBookmark,
  FolderOpen,
  BugReport,
  TableChart,
} from '@mui/icons-material';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#2D3748',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            fontWeight: 600,
            cursor: 'pointer',
            color: '#6B73FF',
          }}
          onClick={() => navigate('/')}
        >
          Ace Template Engine
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color={isActive('/') ? 'primary' : 'inherit'}
            startIcon={<Dashboard />}
            onClick={() => navigate('/')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/') ? '#6B73FF' : '#718096',
              backgroundColor: isActive('/') ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color={isActive('/editor') ? 'primary' : 'inherit'}
            startIcon={<Edit />}
            onClick={() => navigate('/editor')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/editor') ? '#6B73FF' : '#718096',
              backgroundColor: isActive('/editor') ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            Editor
          </Button>
          <Button
            color={isActive('/templates') ? 'primary' : 'inherit'}
            startIcon={<CollectionsBookmark />}
            onClick={() => navigate('/templates')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/templates') ? '#6B73FF' : '#718096',
              backgroundColor: isActive('/templates') ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            Templates
          </Button>
          <Button
            color={isActive('/projects') ? 'primary' : 'inherit'}
            startIcon={<FolderOpen />}
            onClick={() => navigate('/projects')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/projects') ? '#6B73FF' : '#718096',
              backgroundColor: isActive('/projects') ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            Projects
          </Button>
          <Button
            color={isActive('/test-suite') ? 'primary' : 'inherit'}
            startIcon={<BugReport />}
            onClick={() => navigate('/test-suite')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/test-suite') ? '#6B73FF' : '#718096',
              backgroundColor: isActive('/test-suite') ? 'rgba(107, 115, 255, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            Test Suite
          </Button>
        </Box>

        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              color: '#718096',
              '&:hover': {
                backgroundColor: 'rgba(107, 115, 255, 0.08)',
                color: '#6B73FF',
              },
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
