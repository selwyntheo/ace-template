package com.ace.templateengine.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data_queries")
public class DataQueriesController {

    // Get all data queries for an app - matches GET /data_queries
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDataQueries(
            @RequestParam("app_id") String appId) {
        
        // Return empty list for now - in real implementation would fetch from database
        List<Map<String, Object>> queries = List.of();
        
        return ResponseEntity.ok(queries);
    }

    // Create data query - matches POST /data_queries
    @PostMapping
    public ResponseEntity<Map<String, Object>> createDataQuery(
            @RequestBody Map<String, Object> queryData) {
        
        String newId = "query_" + System.currentTimeMillis();
        Map<String, Object> newQuery = Map.of(
            "id", newId,
            "name", queryData.getOrDefault("name", "Untitled Query"),
            "app_id", queryData.get("app_id"),
            "kind", queryData.getOrDefault("kind", "restapi"),
            "options", queryData.getOrDefault("options", Map.of()),
            "data_source_id", queryData.getOrDefault("data_source_id", ""),
            "created_at", java.time.Instant.now().toString(),
            "updated_at", java.time.Instant.now().toString()
        );
        
        return ResponseEntity.ok(newQuery);
    }

    // Update data query - matches PUT /data_queries/:id
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDataQuery(
            @PathVariable String id,
            @RequestBody Map<String, Object> queryData) {
        
        Map<String, Object> updatedQuery = Map.of(
            "id", id,
            "name", queryData.getOrDefault("name", "Untitled Query"),
            "kind", queryData.getOrDefault("kind", "restapi"),
            "options", queryData.getOrDefault("options", Map.of()),
            "data_source_id", queryData.getOrDefault("data_source_id", ""),
            "updated_at", java.time.Instant.now().toString()
        );
        
        return ResponseEntity.ok(updatedQuery);
    }

    // Delete data query - matches DELETE /data_queries/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataQuery(@PathVariable String id) {
        return ResponseEntity.noContent().build();
    }

    // Run data query - matches POST /data_queries/:id/run
    @PostMapping("/{id}/run")
    public ResponseEntity<Map<String, Object>> runDataQuery(
            @PathVariable String id,
            @RequestBody Map<String, Object> runData) {
        
        Map<String, Object> result = Map.of(
            "status", "completed",
            "data", List.of(),
            "metadata", Map.of(
                "query_id", id,
                "execution_time", "100ms"
            )
        );
        
        return ResponseEntity.ok(result);
    }
}
