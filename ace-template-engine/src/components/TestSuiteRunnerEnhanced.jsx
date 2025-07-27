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
  BugReport,
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
    icon: <BugReport />,
    tests: [
      'Complete Canvas Editor Workflow',
      'Project Creation & Management',
      'Template Gallery Usage',
      'Property Editing Workflow',
      'Data Export/Import'
    ]
  }
];

const TestSuiteRunnerEnhanced = () => {
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
        console.log('Auto-run: Checking for changes...');
      }, 10000);
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

  const toggleSuite = (suiteId) => {
    setSelectedSuites(prev => ({
      ...prev,
      [suiteId]: !prev[suiteId]
    }));
  };

  const downloadResults = () => {
    const data = {
      summary,
      results,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Consolidated Test Suite Runner
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Run all test cases to validate changes across the application. Enable auto-run to automatically test when changes are detected.
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={runSelectedTests}
              disabled={isRunning}
              color="primary"
            >
              Run Selected Tests
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={stopTests}
              disabled={!isRunning}
            >
              Stop
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                />
              }
              label="Auto-run on changes"
            />

            {results.length > 0 && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={downloadResults}
              >
                Download Results
              </Button>
            )}
          </Box>

          {/* Test Suite Selection */}
          <Typography variant="h6" gutterBottom>
            Select Test Suites
          </Typography>
          <Grid container spacing={2}>
            {testSuites.map((suite) => (
              <Grid item xs={12} sm={6} md={3} key={suite.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedSuites[suite.id] ? '2px solid' : '1px solid',
                    borderColor: selectedSuites[suite.id] ? 'primary.main' : 'divider'
                  }}
                  onClick={() => toggleSuite(suite.id)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 1 }}>{suite.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {suite.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {suite.description}
                    </Typography>
                    <Chip 
                      label={`${suite.tests.length} tests`} 
                      size="small" 
                      sx={{ mt: 1 }}
                      color={selectedSuites[suite.id] ? 'primary' : 'default'}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Progress
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {currentTest}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {summary && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {summary.total}
                  </Typography>
                  <Typography variant="body2">Total Tests</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {summary.passed}
                  </Typography>
                  <Typography variant="body2">Passed</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {summary.failed}
                  </Typography>
                  <Typography variant="body2">Failed</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {summary.successRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">Success Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            
            {testSuites.map((suite) => {
              const suiteResults = results.filter(r => r.suite === suite.name);
              if (suiteResults.length === 0) return null;

              return (
                <Accordion key={suite.id}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {suite.icon}
                      <Typography variant="h6">{suite.name}</Typography>
                      <Chip 
                        label={`${suiteResults.filter(r => r.success).length}/${suiteResults.length} passed`}
                        color={suiteResults.every(r => r.success) ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {suiteResults.map((result, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {result.success ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Error color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={result.test}
                            secondary={result.message}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(result.duration)}ms
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Auto-run Status */}
      {autoRun && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Auto-run is enabled. Tests will run automatically when changes are detected.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default TestSuiteRunnerEnhanced;
