package com.ace.templateengine.controller;

import com.ace.templateengine.model.Design;
import com.ace.templateengine.service.DesignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Projects Controller - Alias for DesignController
 * This provides the same functionality as DesignController but under /api/projects endpoint
 * for better semantic meaning when referring to projects/applications.
 */
@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "Project management operations (alias for Designs)")
public class ProjectsController {

    @Autowired
    private DesignService designService;

    @Operation(summary = "Create a new project", description = "Creates a new project (same as design)")
    @PostMapping
    public ResponseEntity<Design> createProject(
            @Valid @RequestBody Design project,
            @Parameter(description = "User creating the project") @RequestParam(required = false) String createdBy) {
        
        if (createdBy != null) {
            project.setCreatedBy(createdBy);
            project.setUpdatedBy(createdBy);
        }
        
        Design created = designService.createDesign(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Get all projects", description = "Retrieve all projects with pagination")
    @GetMapping
    public ResponseEntity<Page<Design>> getAllProjects(
            @Parameter(description = "Include public projects only") @RequestParam(defaultValue = "false") boolean publicOnly,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "updatedAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {
        
        Page<Design> projects = designService.getAllDesigns(page, size, sortBy, sortDir);
        return ResponseEntity.ok(projects);
    }

    @Operation(summary = "Get project by ID", description = "Retrieve a specific project by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Design> getProject(@PathVariable String id) {
        Design project = designService.getDesignById(id);
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "Update project", description = "Update an existing project")
    @PutMapping("/{id}")
    public ResponseEntity<Design> updateProject(
            @PathVariable String id,
            @Valid @RequestBody Design project,
            @Parameter(description = "User updating the project") @RequestParam(required = false) String updatedBy) {
        
        if (updatedBy != null) {
            project.setUpdatedBy(updatedBy);
        }
        
        Design updated = designService.updateDesign(id, project);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete project", description = "Delete a project by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        designService.deleteDesign(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Search projects", description = "Search projects by name or description")
    @GetMapping("/search")
    public ResponseEntity<List<Design>> searchProjects(
            @Parameter(description = "Search query") @RequestParam String query) {
        
        List<Design> projects = designService.searchDesigns(query);
        return ResponseEntity.ok(projects);
    }
}
