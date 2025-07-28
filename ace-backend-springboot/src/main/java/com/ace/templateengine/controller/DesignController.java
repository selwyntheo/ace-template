package com.ace.templateengine.controller;

import com.ace.templateengine.model.Design;
import com.ace.templateengine.dto.DesignRequestDTO;
import com.ace.templateengine.dto.DesignStats;
import com.ace.templateengine.service.DesignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/designs")
@Tag(name = "Designs", description = "Design and application management operations for ACE Template Engine")
public class DesignController {

    @Autowired
    private DesignService designService;

    @Operation(
        summary = "Create a new design",
        description = "Creates a new design with all canvas properties and components"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Design created successfully",
                content = @Content(schema = @Schema(implementation = Design.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Design name already exists for user")
    })
    @PostMapping
    public ResponseEntity<Design> createDesign(
            @Valid @RequestBody Design design,
            @Parameter(description = "User creating the design") @RequestParam(required = false) String createdBy) {
        
        if (createdBy != null) {
            design.setCreatedBy(createdBy);
            design.setUpdatedBy(createdBy);
        }
        
        Design createdDesign = designService.createDesign(design);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDesign);
    }

    @Operation(
        summary = "Get all designs",
        description = "Retrieves all designs with optional pagination and sorting"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Designs retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<?> getAllDesigns(
            @Parameter(description = "Enable pagination") @RequestParam(defaultValue = "false") boolean paginated,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "updatedAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDirection) {
        
        if (paginated) {
            Page<Design> designs = designService.getAllDesigns(page, size, sortBy, sortDirection);
            return ResponseEntity.ok(designs);
        } else {
            List<Design> designs = designService.getAllDesigns();
            return ResponseEntity.ok(designs);
        }
    }

    @Operation(
        summary = "Get design by ID",
        description = "Retrieves a specific design by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Design found",
                content = @Content(schema = @Schema(implementation = Design.class))),
        @ApiResponse(responseCode = "404", description = "Design not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Design> getDesignById(
            @Parameter(description = "Design ID") @PathVariable String id) {
        
        Design design = designService.getDesignById(id);
        return ResponseEntity.ok(design);
    }

    @Operation(
        summary = "Update design",
        description = "Updates an existing design with new data"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Design updated successfully",
                content = @Content(schema = @Schema(implementation = Design.class))),
        @ApiResponse(responseCode = "404", description = "Design not found"),
        @ApiResponse(responseCode = "409", description = "Design name already exists for user")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Design> updateDesign(
            @Parameter(description = "Design ID") @PathVariable String id,
            @Valid @RequestBody Design design,
            @Parameter(description = "User updating the design") @RequestParam(required = false) String updatedBy) {
        
        if (updatedBy != null) {
            design.setUpdatedBy(updatedBy);
        }
        
        Design updatedDesign = designService.updateDesign(id, design);
        return ResponseEntity.ok(updatedDesign);
    }

    @Operation(
        summary = "Partially update design",
        description = "Updates specific fields of an existing design"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Design updated successfully",
                content = @Content(schema = @Schema(implementation = Design.class))),
        @ApiResponse(responseCode = "404", description = "Design not found"),
        @ApiResponse(responseCode = "409", description = "Design name already exists for user")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Design> patchDesign(
            @Parameter(description = "Design ID") @PathVariable String id,
            @RequestBody Design partialDesign,
            @Parameter(description = "User updating the design") @RequestParam(required = false) String updatedBy) {
        
        if (updatedBy != null) {
            partialDesign.setUpdatedBy(updatedBy);
        }
        
        Design updatedDesign = designService.patchDesign(id, partialDesign);
        return ResponseEntity.ok(updatedDesign);
    }

    @Operation(
        summary = "Delete design",
        description = "Deletes a design permanently"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Design deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Design not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesign(
            @Parameter(description = "Design ID") @PathVariable String id) {
        
        designService.deleteDesign(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Get designs by creator",
        description = "Retrieves all designs created by a specific user"
    )
    @GetMapping("/creator/{createdBy}")
    public ResponseEntity<?> getDesignsByCreator(
            @Parameter(description = "Creator username") @PathVariable String createdBy,
            @Parameter(description = "Enable pagination") @RequestParam(defaultValue = "false") boolean paginated,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "updatedAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDirection) {
        
        if (paginated) {
            Page<Design> designs = designService.getDesignsByCreator(createdBy, page, size, sortBy, sortDirection);
            return ResponseEntity.ok(designs);
        } else {
            List<Design> designs = designService.getDesignsByCreator(createdBy);
            return ResponseEntity.ok(designs);
        }
    }

    @Operation(
        summary = "Search designs",
        description = "Search designs by name or description"
    )
    @GetMapping("/search")
    public ResponseEntity<List<Design>> searchDesigns(
            @Parameter(description = "Search term") @RequestParam String q) {
        
        List<Design> designs = designService.searchDesigns(q);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs by status",
        description = "Retrieves designs filtered by status"
    )
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Design>> getDesignsByStatus(
            @Parameter(description = "Design status") @PathVariable Design.DesignStatus status) {
        
        List<Design> designs = designService.getDesignsByStatus(status);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get public designs",
        description = "Retrieves all publicly available designs"
    )
    @GetMapping("/public")
    public ResponseEntity<List<Design>> getPublicDesigns() {
        List<Design> designs = designService.getPublicDesigns();
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs by tag",
        description = "Retrieves designs that contain a specific tag"
    )
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Design>> getDesignsByTag(
            @Parameter(description = "Tag name") @PathVariable String tag) {
        
        List<Design> designs = designService.getDesignsByTag(tag);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs by multiple tags",
        description = "Retrieves designs that contain all specified tags"
    )
    @PostMapping("/tags")
    public ResponseEntity<List<Design>> getDesignsByAllTags(
            @RequestBody List<String> tags) {
        
        List<Design> designs = designService.getDesignsByAllTags(tags);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs by category",
        description = "Retrieves designs from a specific category"
    )
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Design>> getDesignsByCategory(
            @Parameter(description = "Category name") @PathVariable String category) {
        
        List<Design> designs = designService.getDesignsByCategory(category);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs by component types",
        description = "Retrieves designs that use specific component types"
    )
    @PostMapping("/components")
    public ResponseEntity<List<Design>> getDesignsByComponentTypes(
            @RequestBody List<String> componentTypes) {
        
        List<Design> designs = designService.getDesignsByComponentTypes(componentTypes);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs created within date range",
        description = "Retrieves designs created between two dates"
    )
    @GetMapping("/created-between")
    public ResponseEntity<List<Design>> getDesignsCreatedBetween(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<Design> designs = designService.getDesignsCreatedBetween(startDate, endDate);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Get designs updated after date",
        description = "Retrieves designs updated after a specific date"
    )
    @GetMapping("/updated-after")
    public ResponseEntity<List<Design>> getDesignsUpdatedAfter(
            @Parameter(description = "Date threshold") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        
        List<Design> designs = designService.getDesignsUpdatedAfter(date);
        return ResponseEntity.ok(designs);
    }

    @Operation(
        summary = "Clone design",
        description = "Creates a copy of an existing design with a new name"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Design cloned successfully",
                content = @Content(schema = @Schema(implementation = Design.class))),
        @ApiResponse(responseCode = "404", description = "Original design not found"),
        @ApiResponse(responseCode = "409", description = "New design name already exists for user")
    })
    @PostMapping("/{id}/clone")
    public ResponseEntity<Design> cloneDesign(
            @Parameter(description = "Original design ID") @PathVariable String id,
            @Parameter(description = "New design name") @RequestParam String newName,
            @Parameter(description = "User creating the clone") @RequestParam String createdBy) {
        
        Design clonedDesign = designService.cloneDesign(id, newName, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(clonedDesign);
    }

    @Operation(
        summary = "Get design statistics",
        description = "Retrieves overall design statistics"
    )
    @GetMapping("/stats")
    public ResponseEntity<DesignStats> getDesignStats() {
        DesignStats stats = designService.getDesignStats();
        return ResponseEntity.ok(stats);
    }

    @Operation(
        summary = "Get user design statistics",
        description = "Retrieves design statistics for a specific user"
    )
    @GetMapping("/stats/user/{createdBy}")
    public ResponseEntity<DesignStats> getDesignStatsByUser(
            @Parameter(description = "Creator username") @PathVariable String createdBy) {
        
        DesignStats stats = designService.getDesignStatsByUser(createdBy);
        return ResponseEntity.ok(stats);
    }

    @Operation(
        summary = "Bulk update design status",
        description = "Updates the status of multiple designs"
    )
    @PatchMapping("/bulk/status")
    public ResponseEntity<Map<String, Object>> bulkUpdateStatus(
            @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<String> designIds = (List<String>) request.get("designIds");
        Design.DesignStatus status = Design.DesignStatus.valueOf((String) request.get("status"));
        String updatedBy = (String) request.get("updatedBy");
        
        Map<String, Object> response = Map.of(
            "message", "Bulk status update completed",
            "updatedCount", designIds.size(),
            "status", status,
            "timestamp", LocalDateTime.now()
        );
        
        // Process each design
        designIds.forEach(id -> {
            Design partialUpdate = new Design();
            partialUpdate.setStatus(status);
            partialUpdate.setUpdatedBy(updatedBy);
            designService.patchDesign(id, partialUpdate);
        });
        
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Export design data",
        description = "Exports design data in JSON format for backup or migration"
    )
    @GetMapping("/{id}/export")
    public ResponseEntity<Design> exportDesign(
            @Parameter(description = "Design ID") @PathVariable String id) {
        
        Design design = designService.getDesignById(id);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"design-" + design.getName() + ".json\"")
                .body(design);
    }
}
