#!/usr/bin/env node

/**
 * Standalone API Test Script
 * 
 * This script can be run independently to test the API integration
 * Usage: node api-test.js
 */

const https = require('https');
const http = require('http');

class ApiTester {
  constructor(baseUrl = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${endpoint}`;
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            } else if (res.statusCode === 204) {
              resolve(null);
            } else {
              resolve(JSON.parse(data || '{}'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }

  async testConnectivity() {
    console.log('🔌 Testing API connectivity...');
    try {
      const designs = await this.request('/designs');
      console.log(`✅ API connected successfully. Found ${designs.length} designs.`);
      return true;
    } catch (error) {
      console.log(`❌ API connection failed: ${error.message}`);
      return false;
    }
  }

  async testCreateDesign() {
    console.log('📝 Testing design creation...');
    try {
      const designData = {
        name: `API Test Design - ${new Date().toISOString()}`,
        description: 'Test design created via API script',
        isPublic: false,
        canvasConfig: {
          width: 1200,
          height: 800,
          backgroundColor: '#ffffff'
        },
        components: [
          {
            id: 'table-1',
            type: 'Table',
            name: 'Test Table',
            position: { x: 50, y: 50 },
            size: { width: 600, height: 300 },
            properties: {
              title: 'Test Data Table',
              dataSource: 'testData'
            }
          },
          {
            id: 'button-1',
            type: 'Button',
            name: 'Test Button',
            position: { x: 50, y: 370 },
            size: { width: 120, height: 36 },
            properties: {
              text: 'Click Me',
              variant: 'contained'
            }
          },
          {
            id: 'input-1',
            type: 'Input',
            name: 'Test Input',
            position: { x: 200, y: 370 },
            size: { width: 200, height: 36 },
            properties: {
              placeholder: 'Enter text...'
            }
          },
          {
            id: 'datepicker-1',
            type: 'DatePicker',
            name: 'Test DatePicker',
            position: { x: 420, y: 370 },
            size: { width: 180, height: 36 },
            properties: {
              label: 'Select Date'
            }
          }
        ],
        tags: ['api-test', 'automation']
      };

      const result = await this.request('/designs', {
        method: 'POST',
        body: JSON.stringify(designData),
        headers: {
          'X-User-ID': 'api-test-user'
        }
      });

      console.log(`✅ Design created successfully with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.log(`❌ Design creation failed: ${error.message}`);
      return null;
    }
  }

  async testRetrieveDesign(designId) {
    console.log(`🔍 Testing design retrieval for ID: ${designId}...`);
    try {
      const design = await this.request(`/designs/${designId}`);
      console.log(`✅ Design retrieved successfully: ${design.name}`);
      console.log(`   Components: ${design.components.length}`);
      console.log(`   Data Sources: ${design.dataSources ? design.dataSources.length : 0}`);
      return true;
    } catch (error) {
      console.log(`❌ Design retrieval failed: ${error.message}`);
      return false;
    }
  }

  async testUpdateDesign(designId) {
    console.log(`📝 Testing design update for ID: ${designId}...`);
    try {
      // First get the current design to preserve required fields
      const currentDesign = await this.request(`/designs/${designId}`);
      
      const updateData = {
        name: currentDesign.name,
        description: 'Updated via API test script',
        canvasConfig: currentDesign.canvasConfig,
        components: currentDesign.components,
        isPublic: currentDesign.isPublic
      };

      const result = await this.request(`/designs/${designId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'X-User-ID': 'api-test-user'
        }
      });

      console.log(`✅ Design updated successfully`);
      return true;
    } catch (error) {
      console.log(`❌ Design update failed: ${error.message}`);
      return false;
    }
  }

  async testDeleteDesign(designId) {
    console.log(`🗑️ Testing design deletion for ID: ${designId}...`);
    try {
      await this.request(`/designs/${designId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': 'api-test-user'
        }
      });

      console.log(`✅ Design deleted successfully`);
      return true;
    } catch (error) {
      console.log(`❌ Design deletion failed: ${error.message}`);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting API Test Suite...\n');
    
    let passedTests = 0;
    let totalTests = 5;
    let testDesignId = null;

    // Test 1: Connectivity
    if (await this.testConnectivity()) {
      passedTests++;
    }
    console.log('');

    // Test 2: Create Design
    testDesignId = await this.testCreateDesign();
    if (testDesignId) {
      passedTests++;
    }
    console.log('');

    if (testDesignId) {
      // Test 3: Retrieve Design
      if (await this.testRetrieveDesign(testDesignId)) {
        passedTests++;
      }
      console.log('');

      // Test 4: Update Design
      if (await this.testUpdateDesign(testDesignId)) {
        passedTests++;
      }
      console.log('');

      // Test 5: Delete Design
      if (await this.testDeleteDesign(testDesignId)) {
        passedTests++;
      }
      console.log('');
    } else {
      console.log('⏭️ Skipping remaining tests due to design creation failure.\n');
    }

    // Summary
    console.log('📊 API TEST RESULTS');
    console.log('═'.repeat(30));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('═'.repeat(30));

    return passedTests === totalTests;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new ApiTester();
  tester.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite error:', error);
      process.exit(1);
    });
}

module.exports = ApiTester;
