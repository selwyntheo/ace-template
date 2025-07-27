# Ace Template Engine Backend

A Spring Boot backend service for the Ace Template Engine with MongoDB integration, providing REST APIs for project management, template handling, and canvas operations.

## Features

- **Project Management**: Create, read, update, delete projects with full CRUD operations
- **Template System**: Create and use templates with categories and tags
- **Canvas Elements**: Manage canvas elements with drag-and-drop support
- **MongoDB Integration**: Document-based storage with Spring Data MongoDB
- **RESTful APIs**: Comprehensive REST endpoints for all operations
- **Auto-save**: Real-time project saving functionality
- **Search & Filter**: Advanced search and filtering capabilities
- **Export/Import**: Project export and import functionality
- **CORS Support**: Configured for frontend integration
- **Exception Handling**: Comprehensive error handling and validation

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data MongoDB**
- **Spring Security** (optional)
- **MongoDB** 
- **MapStruct** for DTO mapping
- **Lombok** for boilerplate reduction
- **Jackson** for JSON processing
- **Maven** for dependency management

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+ (running locally or remotely)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ace-backend-springboot
```

### 2. Configure MongoDB

Make sure MongoDB is running locally on port 27017, or update the connection string in `application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/ace_template_engine
```

### 3. Build and Run

```bash
# Build the project
mvn clean compile

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

### 4. Verify Installation

Check if the service is running:

```bash
curl http://localhost:8080/api/actuator/health
```

## API Documentation

### Base URL: `http://localhost:8080/api`

### Project Endpoints

#### Basic CRUD Operations
- `POST /projects` - Create a new project
- `GET /projects/{id}` - Get project by ID
- `GET /projects` - Get all projects (paginated)
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

#### Search and Filter
- `GET /projects/search?q={query}` - Search projects
- `GET /projects/user/{userId}` - Get projects by user
- `GET /projects/status/{status}` - Get projects by status

#### Template Operations
- `GET /projects/templates` - Get all templates
- `GET /projects/templates/category/{category}` - Get templates by category
- `POST /projects/templates` - Create a template
- `POST /projects/templates/{id}/use` - Use template to create project

#### Project Management
- `POST /projects/{id}/duplicate` - Duplicate project
- `POST /projects/{id}/fork` - Fork project
- `POST /projects/{id}/share` - Generate share token
- `DELETE /projects/{id}/share` - Revoke share token

#### Element Management
- `POST /projects/{id}/elements` - Add element to project
- `PUT /projects/{id}/elements/{elementId}` - Update element
- `DELETE /projects/{id}/elements/{elementId}` - Remove element
- `PUT /projects/{id}/canvas-settings` - Update canvas settings

#### Auto-save
- `PUT /projects/{id}/auto-save` - Auto-save project

### Request/Response Examples

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "My New Project",
  "description": "A sample project",
  "userId": "user123",
  "canvasSettings": {
    "zoom": 100,
    "showGrid": true,
    "showRulers": true
  }
}
```

#### Response
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "64a7f8b2c4e5d6f7a8b9c0d1",
  "name": "My New Project",
  "description": "A sample project",
  "userId": "user123",
  "elements": [],
  "canvasSettings": {
    "zoom": 100,
    "showGrid": true,
    "showRulers": true,
    "canvasWidth": 1200,
    "canvasHeight": 800
  },
  "status": "DRAFT",
  "elementCount": 0,
  "hasElements": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## Configuration

### Application Properties

Key configuration options in `src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/ace_template_engine

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004
app.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true

# Security (currently disabled)
app.security.enabled=false

# Logging
logging.level.com.ace.templateengine=DEBUG
```

### Environment Variables

You can override properties using environment variables:

```bash
export MONGODB_URI=mongodb://localhost:27017/ace_template_engine
export SERVER_PORT=8080
export CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Development

### Project Structure

```
src/main/java/com/ace/templateengine/
├── AceTemplateEngineApplication.java  # Main application class
├── controller/                        # REST controllers
│   └── ProjectController.java
├── service/                           # Business logic
│   ├── ProjectService.java
│   └── impl/
│       └── ProjectServiceImpl.java
├── repository/                        # Data access layer
│   └── ProjectRepository.java
├── model/                            # Domain entities
│   ├── Project.java
│   └── CanvasElement.java
├── dto/                              # Data transfer objects
│   ├── ProjectDTO.java
│   └── CanvasElementDTO.java
├── mapper/                           # Entity-DTO mapping
│   └── ProjectMapper.java
├── config/                           # Configuration classes
│   ├── CorsConfig.java
│   └── JacksonConfig.java
└── exception/                        # Exception handling
    ├── ProjectExceptions.java
    └── GlobalExceptionHandler.java
```

### Building

```bash
# Compile
mvn compile

# Run tests
mvn test

# Package
mvn package

# Clean and rebuild
mvn clean package
```

### Running in Development

```bash
# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run with specific port
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081

# Run with MongoDB connection string
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.data.mongodb.uri=mongodb://localhost:27017/ace_dev
```

## Data Models

### Project Model
- **id**: Unique identifier
- **name**: Project name
- **description**: Project description
- **elements**: Array of canvas elements
- **canvasSettings**: Canvas configuration
- **status**: DRAFT, PUBLISHED, ARCHIVED, TEMPLATE
- **userId**: Owner user ID
- **organizationId**: Organization ID
- **isTemplate**: Template flag
- **isPublic**: Public access flag
- **shareToken**: Sharing token
- **createdAt/updatedAt**: Timestamps

### Canvas Element Model
- **id**: Element identifier
- **type**: Element type (text, button, image, etc.)
- **position**: x, y coordinates
- **size**: width, height dimensions
- **style**: CSS styling properties
- **props**: Component-specific properties
- **content**: Text content
- **zIndex**: Layer order
- **locked**: Edit lock status
- **visible**: Visibility status

## Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS Configuration**: Allows requests from frontend development servers
2. **JSON APIs**: RESTful endpoints returning JSON data
3. **Auto-save Support**: Real-time project synchronization
4. **Error Handling**: Consistent error responses for frontend error handling

### Frontend Integration Example

```javascript
// Create a new project
const createProject = async (projectData) => {
  const response = await fetch('http://localhost:8080/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  
  return response.json();
};

// Auto-save project
const autoSaveProject = async (projectId, projectData) => {
  const response = await fetch(`http://localhost:8080/api/projects/${projectId}/auto-save`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  
  return response.json();
};
```

## Deployment

### Production Build

```bash
mvn clean package -Pprod
```

### Docker Support

Create a Dockerfile:

```dockerfile
FROM openjdk:17-jre-slim

COPY target/ace-template-engine-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]
```

Build and run:

```bash
docker build -t ace-backend .
docker run -p 8080:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/ace_template_engine ace-backend
```

### Environment Variables for Production

```bash
export MONGODB_URI=mongodb://production-mongodb:27017/ace_template_engine
export SERVER_PORT=8080
export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
export SPRING_PROFILES_ACTIVE=prod
```

## Monitoring and Health Checks

The application includes Spring Boot Actuator for monitoring:

- Health check: `GET /api/actuator/health`
- Application info: `GET /api/actuator/info`
- Metrics: `GET /api/actuator/metrics`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in application.properties
   - Verify network connectivity

2. **CORS Issues**
   - Update allowed origins in application.properties
   - Check frontend URL matches configured origins

3. **Port Already in Use**
   - Change server.port in application.properties
   - Kill process using the port: `lsof -ti:8080 | xargs kill`

4. **Build Failures**
   - Ensure Java 17 is installed: `java -version`
   - Clear Maven cache: `mvn clean`
   - Check Maven version: `mvn -version`

### Logging

Enable debug logging for troubleshooting:

```properties
logging.level.com.ace.templateengine=DEBUG
logging.level.org.springframework.data.mongodb=DEBUG
logging.level.org.springframework.web=DEBUG
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
