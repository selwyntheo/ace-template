// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for adding elements to canvas
Cypress.Commands.add('addElementToCanvas', (elementType) => {
  cy.get(`[data-testid="component-${elementType}"]`).trigger('dragstart');
  cy.get('[data-testid="canvas-area"]').trigger('drop');
});

// Custom command for selecting canvas element
Cypress.Commands.add('selectCanvasElement', (index = 0) => {
  cy.get('[data-testid="canvas-element"]').eq(index).click();
});

// Custom command for setting element property
Cypress.Commands.add('setElementProperty', (property, value) => {
  cy.get(`[data-testid="property-${property}"]`).clear().type(value);
});

// Custom command for creating a new project
Cypress.Commands.add('createNewProject', (name = 'Test Project') => {
  cy.visit('/projects');
  cy.contains('Create New Project').click();
  cy.url().should('include', '/editor');
});

// Custom command for using a template
Cypress.Commands.add('useTemplate', (templateName) => {
  cy.visit('/templates');
  cy.contains(templateName).parent().contains('Use Template').click();
  cy.url().should('include', '/editor');
});

// Custom command for saving project
Cypress.Commands.add('saveProject', () => {
  cy.get('[data-testid="save-button"]').click();
});

// Custom command for checking if element exists on canvas
Cypress.Commands.add('shouldHaveCanvasElements', (count) => {
  cy.get('[data-testid="canvas-element"]').should('have.length', count);
});

// Custom command for testing zoom functionality
Cypress.Commands.add('testZoom', () => {
  cy.get('[data-testid="zoom-in"]').click();
  cy.get('[data-testid="zoom-level"]').should('contain', '110%');
  
  cy.get('[data-testid="zoom-out"]').click();
  cy.get('[data-testid="zoom-level"]').should('contain', '100%');
  
  cy.get('[data-testid="zoom-fit"]').click();
});
