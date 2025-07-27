// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Example use:
// cy.mount(<MyComponent />)

import { mount } from 'cypress/react18';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from '../../src/theme/theme';

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = {}, ...mountOptions } = options;

  const wrapped = (
    <BrowserRouter {...routerProps}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );

  return mount(wrapped, mountOptions);
});
