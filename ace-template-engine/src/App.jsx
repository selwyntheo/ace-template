import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import CanvasEditor from './components/CanvasEditor';
import TemplateGallery from './pages/TemplateGallery/TemplateGallery';
import ProjectManager from './pages/ProjectManager/ProjectManager';
import TestSuiteRunnerEnhanced from './components/TestSuiteRunnerEnhanced';

// Create custom theme with subtle colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B73FF', // Soft periwinkle blue
      light: '#9C9EFF',
      dark: '#4F56C9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9AA2', // Soft coral pink
      light: '#FFB3B8',
      dark: '#E8858C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
    grey: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F7FAFC',
          color: '#2D3748',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#718096',
          '&:hover': {
            backgroundColor: 'rgba(107, 115, 255, 0.08)',
            color: '#6B73FF',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="editor" element={<CanvasEditor />} />
              <Route path="editor/:projectId" element={<CanvasEditor />} />
              <Route path="templates" element={<TemplateGallery />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="test-suite" element={<TestSuiteRunnerEnhanced />} />
            </Route>
          </Routes>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
