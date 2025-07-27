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

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
