describe('Ace Template Engine E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Navigation', () => {
    it('should navigate between pages', () => {
      // Start on home page
      cy.contains('Welcome to Ace Template Engine').should('be.visible');

      // Navigate to Templates
      cy.contains('Templates').click();
      cy.contains('Template Gallery').should('be.visible');
      cy.url().should('include', '/templates');

      // Navigate to Projects
      cy.contains('Projects').click();
      cy.contains('Project Manager').should('be.visible');
      cy.url().should('include', '/projects');

      // Navigate to Editor
      cy.contains('Editor').click();
      cy.contains('Canvas Editor').should('be.visible');
      cy.url().should('include', '/editor');

      // Back to Home
      cy.contains('Home').click();
      cy.contains('Welcome to Ace Template Engine').should('be.visible');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Template Gallery', () => {
    beforeEach(() => {
      cy.visit('/templates');
    });

    it('should search templates', () => {
      cy.get('[placeholder="Search templates..."]').type('landing');
      cy.contains('Modern Landing Page').should('be.visible');
      cy.contains('Email Newsletter').should('not.exist');
    });

    it('should filter templates by category', () => {
      cy.get('[data-testid="category-select"]').click();
      cy.contains('Email Templates').click();
      cy.contains('Email Newsletter').should('be.visible');
      cy.contains('Modern Landing Page').should('not.exist');
    });

    it('should use a template', () => {
      cy.contains('Use Template').first().click();
      cy.url().should('include', '/editor');
      cy.contains('Canvas Editor').should('be.visible');
    });

    it('should preview templates', () => {
      cy.contains('Preview').first().click();
      // Preview functionality should be visible
    });
  });

  describe('Project Manager', () => {
    beforeEach(() => {
      cy.visit('/projects');
    });

    it('should create new project', () => {
      cy.contains('Create New Project').click();
      cy.url().should('include', '/editor');
    });

    it('should search projects', () => {
      cy.get('[placeholder="Search projects..."]').type('Website');
      // Should filter projects (if any exist)
    });

    it('should change view mode', () => {
      cy.get('[data-testid="grid-view-button"]').click();
      cy.get('[data-testid="grid-view"]').should('be.visible');
      
      cy.get('[data-testid="list-view-button"]').click();
      cy.get('[data-testid="list-view"]').should('be.visible');
    });
  });

  describe('Canvas Editor', () => {
    beforeEach(() => {
      cy.visit('/editor');
    });

    it('should display main editor interface', () => {
      cy.contains('Canvas Editor').should('be.visible');
      cy.get('[data-testid="component-panel"]').should('be.visible');
      cy.get('[data-testid="canvas-area"]').should('be.visible');
      cy.get('[data-testid="properties-panel"]').should('be.visible');
    });

    it('should add elements to canvas', () => {
      // Drag a component from the panel to canvas
      cy.get('[data-testid="component-text"]').trigger('dragstart');
      cy.get('[data-testid="canvas-area"]').trigger('drop');
      
      // Element should appear on canvas
      cy.get('[data-testid="canvas-element"]').should('exist');
    });

    it('should select and edit elements', () => {
      // First add an element
      cy.get('[data-testid="component-text"]').trigger('dragstart');
      cy.get('[data-testid="canvas-area"]').trigger('drop');
      
      // Click to select element
      cy.get('[data-testid="canvas-element"]').first().click();
      
      // Properties panel should show element properties
      cy.get('[data-testid="properties-panel"]').should('contain', 'Properties');
    });

    it('should handle zoom controls', () => {
      cy.get('[data-testid="zoom-in"]').click();
      cy.get('[data-testid="zoom-out"]').click();
      cy.get('[data-testid="zoom-fit"]').click();
    });

    it('should use keyboard shortcuts', () => {
      // Test undo (Ctrl+Z)
      cy.get('body').type('{ctrl}z');
      
      // Test redo (Ctrl+Y)
      cy.get('body').type('{ctrl}y');
      
      // Test delete (Delete key)
      cy.get('body').type('{del}');
    });

    it('should save project', () => {
      cy.get('[data-testid="save-button"]').click();
      // Should show save confirmation or dialog
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.contains('Welcome to Ace Template Engine').should('be.visible');
      
      // Navigation should be responsive
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/editor');
      cy.contains('Canvas Editor').should('be.visible');
      
      // Panels should adapt to tablet layout
      cy.get('[data-testid="component-panel"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/');
      
      // Tab through navigation
      cy.get('body').tab();
      cy.focused().should('contain', 'Home');
      
      cy.get('body').tab();
      cy.focused().should('contain', 'Templates');
      
      // Enter should activate links
      cy.focused().type('{enter}');
      cy.url().should('include', '/templates');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/editor');
      
      cy.get('[data-testid="component-panel"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="canvas-area"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="properties-panel"]').should('have.attr', 'aria-label');
    });

    it('should support screen readers', () => {
      cy.visit('/');
      
      // Check for semantic HTML structure
      cy.get('main').should('exist');
      cy.get('nav').should('exist');
      cy.get('h1').should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 pages', () => {
      cy.visit('/nonexistent-page', { failOnStatusCode: false });
      cy.contains('Page Not Found').should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('GET', '/api/**', { forceNetworkError: true });
      cy.visit('/');
      
      // App should still load basic interface
      cy.contains('Welcome to Ace Template Engine').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load pages quickly', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(3000); // 3 seconds
        },
      });
    });

    it('should handle large number of canvas elements', () => {
      cy.visit('/editor');
      
      // Add multiple elements
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="component-text"]').trigger('dragstart');
        cy.get('[data-testid="canvas-area"]').trigger('drop');
      }
      
      // Canvas should still be responsive
      cy.get('[data-testid="canvas-area"]').should('be.visible');
      cy.get('[data-testid="canvas-element"]').should('have.length', 10);
    });
  });
});
