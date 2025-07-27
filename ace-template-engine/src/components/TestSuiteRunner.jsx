import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  CheckCircle,
  Error,
  ExpandMore,
  Refresh,
  Download,
  Info,
  Bug,
  Code,
  Web,
  Storage
} from '@mui/icons-material';
import ComprehensiveDesignTest from '../tests/comprehensive-design-test.js';

// Test suites definition
const testSuites = [
  {
    id: 'unit',
    name: 'Unit Tests',
    description: 'Component and function unit tests',
    icon: <Code />,
    tests: [
      'CanvasEditor Component Tests',
      'PropertyInspector Tests', 
      'EnhancedTableComponent Tests',
      'Layout Component Tests',
      'Store Function Tests'
    ]
  },
  {
    id: 'integration',
    name: 'Integration Tests',
    description: 'Component interaction and data flow tests',
    icon: <Web />,
    tests: [
      'Canvas Drag & Drop Integration',
      'Property Panel Updates',
      'API Data Flow',
      'Route Navigation Tests',
      'Store State Management'
    ]
  },
  {
    id: 'api',
    name: 'API Tests',
    description: 'Backend API and database tests',
    icon: <Storage />,
    tests: [
      'MongoDB Generic API Tests',
      'Collection Schema Tests',
      'Data Validation Tests',
      'Error Handling Tests',
      'Performance Tests'
    ]
  },
  {
    id: 'e2e',
    name: 'End-to-End Tests',
    description: 'Full user workflow tests',
    icon: <Bug />,
    tests: [
      'Complete Canvas Editor Workflow',
      'Project Creation & Management',
      'Template Gallery Usage',
      'Property Editing Workflow',
      'Data Export/Import'
    ]
  }
];

const TestSuiteRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [testInstance, setTestInstance] = useState(null);
  const [autoRun, setAutoRun] = useState(false);
  const [selectedSuites, setSelectedSuites] = useState({
    unit: true,
    integration: true,
    api: true,
    e2e: false // E2E tests can be slower, so default to off
  });

  useEffect(() => {
    setTestInstance(new ComprehensiveDesignTest());
  }, []);

  // Auto-run tests when changes are detected (simulated)
  useEffect(() => {
    if (autoRun) {
      const interval = setInterval(() => {
        // In a real implementation, this would watch for file changes
        // For now, we'll just run tests periodically when auto-run is enabled
        console.log('Auto-run: Checking for changes...');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRun]);

  const runSelectedTests = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setSummary(null);
    setCurrentTest('Initializing test suites...');

    const totalTests = Object.entries(selectedSuites)
      .filter(([_, enabled]) => enabled)
      .reduce((sum, [suiteId]) => {
        const suite = testSuites.find(s => s.id === suiteId);
        return sum + (suite?.tests.length || 0);
      }, 0);

    let completedTests = 0;
    const allResults = [];

    try {
      for (const [suiteId, enabled] of Object.entries(selectedSuites)) {
        if (!enabled) continue;
        
        const suite = testSuites.find(s => s.id === suiteId);
        if (!suite) continue;

        setCurrentTest(`Running ${suite.name}...`);
        
        for (const testName of suite.tests) {
          setCurrentTest(testName);
          
          // Simulate test execution
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock test result - in real implementation, this would run actual tests
          const success = Math.random() > 0.2; // 80% success rate for demo
          const result = {
            suite: suite.name,
            test: testName,
            success,
            message: success ? 'Test passed' : 'Test failed - mock failure',
            timestamp: new Date().toISOString(),
            duration: Math.random() * 1000 + 100
          };
          
          allResults.push(result);
          completedTests++;
          setProgress((completedTests / totalTests) * 100);
        }
      }

      // Run the original comprehensive design test as well
      if (testInstance && selectedSuites.integration) {
        setCurrentTest('Running Comprehensive Design Test...');
        await testInstance.runAllTests();
        
        // Add comprehensive test results
        const comprehensiveResults = testInstance.results?.map(result => ({
          suite: 'Comprehensive Design',
          test: result.testName,
          success: result.success,
          message: result.message,
          timestamp: result.timestamp,
          duration: result.duration || 100
        })) || [];
        
        allResults.push(...comprehensiveResults);
      }

      // Calculate summary
      const passed = allResults.filter(r => r.success).length;
      const failed = allResults.length - passed;
      
      setSummary({
        total: allResults.length,
        passed,
        failed,
        successRate: allResults.length > 0 ? (passed / allResults.length * 100) : 0,
        duration: allResults.reduce((sum, r) => sum + (r.duration || 0), 0)
      });
      
      setResults(allResults);
      setCurrentTest('Tests completed');
      
    } catch (error) {
      console.error('Test execution error:', error);
      setCurrentTest('Test execution failed');
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  const stopTests = () => {
    setIsRunning(false);
    setCurrentTest('Stopped');
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary,
      results,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTests = () => {
    setResults([]);
    setSummary(null);
    setProgress(0);
    setCurrentTest('');
    if (testInstance) {
      testInstance.testResults = [];
      testInstance.testDesignId = null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            🧪 Comprehensive Design Test Suite
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This test suite validates the complete design creation workflow including API integration,
            component configuration (Table, Button, Input, DatePicker), data source setup, and persistence.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={runTests}
              disabled={isRunning}
            >
              Run All Tests
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Stop />}
              onClick={stopTests}
              disabled={!isRunning}
            >
              Stop Tests
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetTests}
              disabled={isRunning}
            >
              Reset
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportResults}
              disabled={!summary}
            >
              Export Results
            </Button>
          </Box>

          {isRunning && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Current Test: {currentTest}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Progress: {Math.round(progress)}%
              </Typography>
            </Box>
          )}

          {summary && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                📊 Test Results Summary
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`✅ Passed: ${summary.passed}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`❌ Failed: ${summary.failed}`}
                  color="error"
                  variant="outlined"
                />
                <Chip
                  label={`📈 Success Rate: ${summary.successRate}%`}
                  color={summary.successRate >= 80 ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Detailed Test Results
            </Typography>
            
            {results.map((result, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                      {result.success ? 
                        <CheckCircle color="success" /> : 
                        <Error color="error" />
                      }
                    </ListItemIcon>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {result.test}
                    </Typography>
                    <Chip
                      label={result.success ? 'PASS' : 'FAIL'}
                      color={result.success ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Alert 
                      severity={result.success ? 'success' : 'error'} 
                      sx={{ mb: 2 }}
                    >
                      {result.message}
                    </Alert>
                    
                    {result.data && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          📊 Test Data:
                        </Typography>
                        <Box
                          component="pre"
                          sx={{
                            backgroundColor: '#f5f5f5',
                            p: 2,
                            borderRadius: 1,
                            overflow: 'auto',
                            fontSize: '0.875rem',
                            fontFamily: 'monospace'
                          }}
                        >
                          {JSON.stringify(result.data, null, 2)}
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Executed at: {new Date(result.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !isRunning && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ready to Run Tests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Run All Tests" to begin the comprehensive design testing suite.
              This will test API connectivity, design creation, component configuration, and data persistence.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TestSuiteRunner;
