// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
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

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from the Cypress command log
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch;
  win.fetch = (...args) => {
    return originalFetch(...args);
  };
});

// Add custom commands for keyboard navigation
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject, options) => {
  return cy.wrap(subject).trigger('keydown', {
    keyCode: 9,
    which: 9,
    ...options,
  });
});

// Custom command for drag and drop
Cypress.Commands.add('dragAndDrop', (source, target) => {
  cy.get(source).trigger('mousedown', { which: 1 });
  cy.get(target).trigger('mousemove').trigger('mouseup');
});

// Custom command for waiting for React to be ready
Cypress.Commands.add('waitForReact', () => {
  cy.window().should('have.property', 'React');
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
