#!/bin/bash

# Build and run the ACE Template Engine Backend
echo "Building ACE Template Engine Backend..."

# Clean and package
mvn clean package -DskipTests -q

if [ $? -eq 0 ]; then
    echo "Build successful! Starting server on port 8080..."
    
    # Kill any existing process on port 8080
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    
    # Start the application
    java -jar target/ace-template-engine-backend-1.0.0.jar
else
    echo "Build failed!"
    exit 1
fi
