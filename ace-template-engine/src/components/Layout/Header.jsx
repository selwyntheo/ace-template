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
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Ace Template Engine
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button
            color={isActive('/') ? 'secondary' : 'inherit'}
            startIcon={<Dashboard />}
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none' }}
          >
            Dashboard
          </Button>
          <Button
            color={isActive('/editor') ? 'secondary' : 'inherit'}
            startIcon={<Edit />}
            onClick={() => navigate('/editor')}
            sx={{ textTransform: 'none' }}
          >
            Editor
          </Button>
          <Button
            color={isActive('/templates') ? 'secondary' : 'inherit'}
            startIcon={<CollectionsBookmark />}
            onClick={() => navigate('/templates')}
            sx={{ textTransform: 'none' }}
          >
            Templates
          </Button>
          <Button
            color={isActive('/projects') ? 'secondary' : 'inherit'}
            startIcon={<FolderOpen />}
            onClick={() => navigate('/projects')}
            sx={{ textTransform: 'none' }}
          >
            Projects
          </Button>
          <Button
            color={isActive('/test-suite') ? 'secondary' : 'inherit'}
            startIcon={<BugReport />}
            onClick={() => navigate('/test-suite')}
            sx={{ textTransform: 'none' }}
          >
            Test Suite
          </Button>
          <Button
            color={isActive('/table-test') ? 'secondary' : 'inherit'}
            startIcon={<TableChart />}
            onClick={() => navigate('/table-test')}
            sx={{ textTransform: 'none' }}
          >
            Table Test
          </Button>
        </Box>

        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
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
