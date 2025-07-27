package com.ace.templateengine.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@Tag(name = "Health & Status", description = "Health check and system status endpoints")
public class HealthController {

    @Operation(summary = "Health check", description = "Check the health status of the ACE Template Engine backend")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ACE Template Engine Backend");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get API version", description = "Retrieve the current API version information")
    @ApiResponse(responseCode = "200", description = "Version information retrieved")
    @GetMapping("/version")
    public ResponseEntity<Map<String, String>> version() {
        Map<String, String> response = new HashMap<>();
        response.put("version", "1.0.0");
        response.put("service", "ace-template-engine-backend");
        response.put("description", "ACE Template Engine - Dynamic UI Builder");
        return ResponseEntity.ok(response);
    }
}
