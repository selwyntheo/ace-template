import React from 'react';
import { AdvancedComponentLibrary } from './components/UI';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B9CAE',
    },
    secondary: {
      main: '#247a89',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function ComponentLibraryDemo() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdvancedComponentLibrary />
    </ThemeProvider>
  );
}

export default ComponentLibraryDemo;
