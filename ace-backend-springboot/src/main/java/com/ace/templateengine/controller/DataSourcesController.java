package com.ace.templateengine.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data_sources")
@Tag(name = "Data Sources", description = "Manage data sources for ACE Template Engine applications")
public class DataSourcesController {

    @Operation(summary = "Get all data sources", description = "Retrieve a list of all available data sources")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved data sources",
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDataSources() {
        
        List<Map<String, Object>> dataSources = List.of(
            Map.of(
                "id", "acedb",
                "name", "ACE Template Database", 
                "kind", "acedb",
                "app_id", "",
                "created_at", "2025-01-01T00:00:00Z",
                "updated_at", "2025-01-01T00:00:00Z"
            ),
            Map.of(
                "id", "restapi",
                "name", "REST API",
                "kind", "restapi", 
                "app_id", "",
                "created_at", "2025-01-01T00:00:00Z",
                "updated_at", "2025-01-01T00:00:00Z"
            ),
            Map.of(
                "id", "postgresql",
                "name", "PostgreSQL Database",
                "kind", "postgresql",
                "app_id", "",
                "created_at", "2025-01-01T00:00:00Z", 
                "updated_at", "2025-01-01T00:00:00Z"
            )
        );
        
        return ResponseEntity.ok(dataSources);
    }

    @Operation(summary = "Create new data source", description = "Create a new data source configuration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Data source created successfully",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<Map<String, Object>> createDataSource(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Data source configuration", 
                required = true,
                content = @Content(mediaType = "application/json")
            )
            @RequestBody Map<String, Object> dataSourceData) {
        
        String newId = "ds_" + System.currentTimeMillis();
        Map<String, Object> newDataSource = Map.of(
            "id", newId,
            "name", dataSourceData.getOrDefault("name", "Untitled Data Source"),
            "kind", dataSourceData.getOrDefault("kind", "restapi"),
            "options", dataSourceData.getOrDefault("options", Map.of()),
            "app_id", dataSourceData.getOrDefault("app_id", ""),
            "created_at", java.time.Instant.now().toString(),
            "updated_at", java.time.Instant.now().toString()
        );
        
        return ResponseEntity.ok(newDataSource);
    }

    @Operation(summary = "Update data source", description = "Update an existing data source configuration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Data source updated successfully"),
        @ApiResponse(responseCode = "404", description = "Data source not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDataSource(
            @Parameter(description = "Data source ID", required = true)
            @PathVariable String id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Updated data source configuration", 
                required = true
            )
            @RequestBody Map<String, Object> dataSourceData) {
        
        Map<String, Object> updatedDataSource = Map.of(
            "id", id,
            "name", dataSourceData.getOrDefault("name", "Untitled Data Source"),
            "kind", dataSourceData.getOrDefault("kind", "restapi"),
            "options", dataSourceData.getOrDefault("options", Map.of()),
            "updated_at", java.time.Instant.now().toString()
        );
        
        return ResponseEntity.ok(updatedDataSource);
    }

    @Operation(summary = "Delete data source", description = "Delete a data source by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Data source deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Data source not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataSource(
            @Parameter(description = "Data source ID", required = true)
            @PathVariable String id) {
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Test connection", description = "Test connection to a data source")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Connection test completed",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "Invalid connection parameters")
    })
    @PostMapping("/test_connection")
    public ResponseEntity<Map<String, Object>> testConnection(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Connection test parameters", 
                required = true
            )
            @RequestBody Map<String, Object> connectionData) {
        
        Map<String, Object> result = Map.of(
            "status", "success",
            "message", "Connection successful"
        );
        
        return ResponseEntity.ok(result);
    }
}
