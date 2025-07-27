#!/bin/bash

# Ace Template Engine Backend - Development Start Script

echo "🚀 Starting Ace Template Engine Backend..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "(.*)(?=")' | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17 or higher is required. Found Java $JAVA_VERSION"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! mongosh --eval "db.runCommand('ping').ok" localhost:27017/test --quiet &> /dev/null; then
    echo "⚠️  MongoDB is not running on localhost:27017"
    echo "   Please start MongoDB before running the backend."
    echo "   You can start MongoDB with: brew services start mongodb/brew/mongodb-community"
    echo "   Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    read -p "   Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Prerequisites check passed"

# Set environment variables for development
export SPRING_PROFILES_ACTIVE=dev
export SERVER_PORT=8080
export MONGODB_URI=mongodb://localhost:27017/ace_template_engine

echo "🔧 Building the application..."

# Clean and compile
if ! mvn clean compile; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo "🌐 Starting server on http://localhost:8080/api"
echo "📊 Health check: http://localhost:8080/api/actuator/health"
echo "📚 API base URL: http://localhost:8080/api/projects"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the application
mvn spring-boot:run
