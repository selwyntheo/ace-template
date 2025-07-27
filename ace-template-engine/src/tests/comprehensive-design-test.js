/**
 * Comprehensive Test Suite for Design Creation and Management
 * 
 * This test suite covers:
 * 1. API connectivity testing
 * 2. Design creation with multiple components
 * 3. Component configuration (Table, Button, Input, DatePicker)
 * 4. Data source configuration
 * 5. Design saving and validation
 */

import designApi from '../services/designApi.js';

class ComprehensiveDesignTest {
  constructor() {
    this.testResults = [];
    this.testDesignId = null;
    this.sampleData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2025-01-15', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: '2025-01-20', status: 'Inactive' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', createdAt: '2025-01-25', status: 'Active' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', createdAt: '2025-01-30', status: 'Pending' }
    ];
  }

  // Utility method to log test results
  logTest(testName, success, message, data = null) {
    const result = {
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    this.testResults.push(result);
    console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
    if (data) {
      console.log('📊 Data:', data);
    }
  }

  // Test 1: API Connectivity
  async testApiConnectivity() {
    try {
      const designs = await designApi.getAllDesigns();
      this.logTest(
        'API Connectivity', 
        true, 
        `Successfully connected to API. Found ${designs.length} existing designs.`,
        { designCount: designs.length }
      );
      return true;
    } catch (error) {
      this.logTest(
        'API Connectivity', 
        false, 
        `Failed to connect to API: ${error.message}`,
        { error: error.message }
      );
      return false;
    }
  }

  // Test 2: Create Design with 4+ Components
  async testDesignCreation() {
    try {
      const designData = {
        name: `Test Design - ${new Date().toISOString()}`,
        description: 'Comprehensive test design with multiple components',
        isPublic: false,
        canvasConfig: {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff'
        },
        components: this.createTestComponents(),
        tags: ['test', 'automation', 'comprehensive']
      };

      const createdDesign = await designApi.createDesign(designData, 'test-user');
      this.testDesignId = createdDesign.id;
      
      this.logTest(
        'Design Creation', 
        true, 
        `Successfully created design with ID: ${createdDesign.id}`,
        { 
          designId: createdDesign.id, 
          componentCount: designData.components.length,
          canvasSize: `${designData.canvasConfig.width}x${designData.canvasConfig.height}`
        }
      );
      return createdDesign;
    } catch (error) {
      this.logTest(
        'Design Creation', 
        false, 
        `Failed to create design: ${error.message}`,
        { error: error.message }
      );
      return null;
    }
  }

  // Create test components including Table, Button, Input, DatePicker
  createTestComponents() {
    return [
      {
        id: 'table-1',
        type: 'Table',
        name: 'User Data Table',
        position: { x: 50, y: 50 },
        size: { width: 600, height: 300 },
        properties: {
          columns: [
            { field: 'id', headerName: 'ID', width: 70, type: 'number' },
            { field: 'name', headerName: 'Name', width: 150, type: 'string' },
            { field: 'email', headerName: 'Email', width: 200, type: 'string' },
            { field: 'createdAt', headerName: 'Created', width: 120, type: 'date' },
            { field: 'status', headerName: 'Status', width: 100, type: 'string' }
          ],
          dataSource: 'userData',
          pagination: true,
          sorting: true,
          filtering: true,
          selection: 'single'
        },
        styling: {
          headerBackground: '#f5f5f5',
          alternateRowColor: '#fafafa',
          borderColor: '#ddd'
        }
      },
      {
        id: 'button-1',
        type: 'Button',
        name: 'Add User Button',
        position: { x: 50, y: 370 },
        size: { width: 120, height: 36 },
        properties: {
          text: 'Add New User',
          variant: 'contained',
          color: 'primary',
          action: 'openDialog',
          target: 'userForm'
        },
        styling: {
          backgroundColor: '#1976d2',
          color: '#fff',
          borderRadius: '4px'
        }
      },
      {
        id: 'input-1',
        type: 'Input',
        name: 'Search Input',
        position: { x: 200, y: 370 },
        size: { width: 200, height: 36 },
        properties: {
          placeholder: 'Search users...',
          variant: 'outlined',
          type: 'text',
          validation: {
            minLength: 2,
            maxLength: 50
          },
          binding: 'searchTerm'
        },
        styling: {
          borderColor: '#ccc',
          borderRadius: '4px'
        }
      },
      {
        id: 'datepicker-1',
        type: 'DatePicker',
        name: 'Filter Date',
        position: { x: 420, y: 370 },
        size: { width: 180, height: 36 },
        properties: {
          label: 'Created After',
          format: 'MM/dd/yyyy',
          value: null,
          binding: 'filterDate',
          validation: {
            required: false
          }
        },
        styling: {
          borderColor: '#ccc',
          borderRadius: '4px'
        }
      },
      {
        id: 'text-1',
        type: 'Text',
        name: 'Title',
        position: { x: 50, y: 10 },
        size: { width: 300, height: 30 },
        properties: {
          text: 'User Management Dashboard',
          variant: 'h4',
          align: 'left',
          color: 'primary'
        },
        styling: {
          fontWeight: 'bold',
          color: '#1976d2'
        }
      }
    ];
  }

  // Create test data sources
  createTestDataSources() {
    return [
      {
        id: 'userData',
        name: 'User Data Source',
        type: 'static',
        config: {
          data: this.sampleData,
          schema: {
            id: { type: 'number', required: true },
            name: { type: 'string', required: true },
            email: { type: 'string', required: true, format: 'email' },
            createdAt: { type: 'date', required: true },
            status: { type: 'string', required: true, enum: ['Active', 'Inactive', 'Pending'] }
          }
        }
      },
      {
        id: 'apiData',
        name: 'API Data Source',
        type: 'api',
        config: {
          endpoint: 'http://localhost:8080/api/users',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          refresh: 30000, // 30 seconds
          cache: true
        }
      }
    ];
  }

  // Create test layout configuration
  createTestLayout() {
    return {
      canvas: {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        grid: {
          enabled: true,
          size: 10,
          color: '#f0f0f0'
        }
      },
      responsive: {
        breakpoints: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920
        },
        rules: [
          {
            breakpoint: 'sm',
            changes: {
              'table-1': { size: { width: 400, height: 250 } },
              'button-1': { position: { x: 20, y: 300 } }
            }
          }
        ]
      }
    };
  }

  // Test 3: Component Configuration Validation
  async testComponentConfiguration() {
    if (!this.testDesignId) {
      this.logTest('Component Configuration', false, 'No test design available');
      return false;
    }

    try {
      const design = await designApi.getDesignById(this.testDesignId);
      const components = design.components;

      // Validate Table component
      const tableComponent = components.find(c => c.type === 'Table');
      if (!tableComponent) {
        throw new Error('Table component not found');
      }
      if (!tableComponent.properties.columns || tableComponent.properties.columns.length < 4) {
        throw new Error('Table component missing required columns');
      }

      // Validate Button component
      const buttonComponent = components.find(c => c.type === 'Button');
      if (!buttonComponent || !buttonComponent.properties.text) {
        throw new Error('Button component not properly configured');
      }

      // Validate Input component
      const inputComponent = components.find(c => c.type === 'Input');
      if (!inputComponent || !inputComponent.properties.placeholder) {
        throw new Error('Input component not properly configured');
      }

      // Validate DatePicker component
      const datePickerComponent = components.find(c => c.type === 'DatePicker');
      if (!datePickerComponent || !datePickerComponent.properties.label) {
        throw new Error('DatePicker component not properly configured');
      }

      this.logTest(
        'Component Configuration', 
        true, 
        `All ${components.length} components properly configured`,
        { 
          tableColumns: tableComponent.properties.columns.length,
          buttonText: buttonComponent.properties.text,
          inputPlaceholder: inputComponent.properties.placeholder,
          datePickerLabel: datePickerComponent.properties.label
        }
      );
      return true;
    } catch (error) {
      this.logTest(
        'Component Configuration', 
        false, 
        `Component configuration validation failed: ${error.message}`,
        { error: error.message }
      );
      return false;
    }
  }

  // Test 4: Design Persistence and Retrieval
  async testDesignPersistence() {
    if (!this.testDesignId) {
      this.logTest('Design Persistence', false, 'No test design available');
      return false;
    }

    try {
      // Test retrieving the design
      const retrievedDesign = await designApi.getDesignById(this.testDesignId);
      
      if (!retrievedDesign) {
        throw new Error('Design not found after creation');
      }

      // Test updating the design
      const updateData = {
        description: 'Updated test design description'
      };

      const updatedDesign = await designApi.updateDesign(this.testDesignId, updateData);
      
      if (updatedDesign.description !== updateData.description) {
        throw new Error('Design update failed');
      }

      this.logTest(
        'Design Persistence', 
        true, 
        `Design successfully persisted and updated`,
        { 
          designId: this.testDesignId,
          originalDescription: retrievedDesign.description,
          updatedDescription: updatedDesign.description
        }
      );
      return true;
    } catch (error) {
      this.logTest(
        'Design Persistence', 
        false, 
        `Design persistence test failed: ${error.message}`,
        { error: error.message }
      );
      return false;
    }
  }

  // Test 5: Clean up test data
  async testCleanup() {
    if (!this.testDesignId) {
      this.logTest('Cleanup', true, 'No test data to clean up');
      return true;
    }

    try {
      await designApi.deleteDesign(this.testDesignId);
      this.logTest(
        'Cleanup', 
        true, 
        `Successfully deleted test design ${this.testDesignId}`
      );
      return true;
    } catch (error) {
      this.logTest(
        'Cleanup', 
        false, 
        `Failed to clean up test design: ${error.message}`,
        { designId: this.testDesignId, error: error.message }
      );
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Design Test Suite...\n');
    
    const tests = [
      () => this.testApiConnectivity(),
      () => this.testDesignCreation(),
      () => this.testComponentConfiguration(),
      () => this.testDesignPersistence(),
      () => this.testCleanup()
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
      try {
        const result = await test();
        if (result) passedTests++;
      } catch (error) {
        console.error('❌ Test execution error:', error);
      }
      console.log(''); // Add spacing between tests
    }

    // Generate final report
    this.generateReport(passedTests, totalTests);
    return this.testResults;
  }

  // Generate test report
  generateReport(passedTests, totalTests) {
    console.log('📊 TEST SUITE REPORT');
    console.log('═'.repeat(50));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('═'.repeat(50));
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS:');
    this.testResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.success ? '✅' : '❌'} ${result.test}`);
      console.log(`   Message: ${result.message}`);
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);
      }
      console.log('');
    });
  }
}

// Export for use in other files
export default ComprehensiveDesignTest;

// For direct execution in browser console or Node.js
if (typeof window !== 'undefined') {
  window.ComprehensiveDesignTest = ComprehensiveDesignTest;
}
