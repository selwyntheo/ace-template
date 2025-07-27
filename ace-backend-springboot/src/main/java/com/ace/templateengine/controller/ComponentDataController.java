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
@RequestMapping("/api")
@Tag(name = "Component Data", description = "Data endpoints for ACE Template Engine UI components")
public class ComponentDataController {

    @Operation(summary = "Get table data", description = "Retrieve sample data for table components")
    @ApiResponse(responseCode = "200", description = "Table data retrieved successfully")
    @GetMapping("/table-data")
    public ResponseEntity<List<Map<String, Object>>> getTableData() {
        List<Map<String, Object>> tableData = List.of(
            Map.of(
                "id", 1,
                "name", "John Doe",
                "email", "john@example.com",
                "status", "Active",
                "created_at", "2025-01-01"
            ),
            Map.of(
                "id", 2,
                "name", "Jane Smith",
                "email", "jane@example.com", 
                "status", "Inactive",
                "created_at", "2025-01-02"
            ),
            Map.of(
                "id", 3,
                "name", "Bob Johnson",
                "email", "bob@example.com",
                "status", "Active", 
                "created_at", "2025-01-03"
            )
        );
        return ResponseEntity.ok(tableData);
    }

    @GetMapping("/table-data/{id}")
    public ResponseEntity<Map<String, Object>> getTableDataById(@PathVariable Long id) {
        Map<String, Object> data = Map.of(
            "id", id,
            "name", "User " + id,
            "email", "user" + id + "@example.com",
            "status", "Active",
            "created_at", "2025-01-01"
        );
        return ResponseEntity.ok(data);
    }

    // Form endpoints - used by form components
    @PostMapping("/form-submit")
    public ResponseEntity<Map<String, Object>> submitForm(@RequestBody Map<String, Object> formData) {
        Map<String, Object> response = Map.of(
            "success", true,
            "message", "Form submitted successfully",
            "data", formData,
            "id", System.currentTimeMillis()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/form-data/{id}")
    public ResponseEntity<Map<String, Object>> getFormData(@PathVariable Long id) {
        Map<String, Object> formData = Map.of(
            "id", id,
            "title", "Sample Form " + id,
            "description", "This is a sample form",
            "fields", List.of(
                Map.of("name", "firstName", "value", "John"),
                Map.of("name", "lastName", "value", "Doe"),
                Map.of("name", "email", "value", "john@example.com")
            )
        );
        return ResponseEntity.ok(formData);
    }

    // List data endpoints - used by list components
    @GetMapping("/list-items")
    public ResponseEntity<List<Map<String, Object>>> getListItems() {
        List<Map<String, Object>> listItems = List.of(
            Map.of("id", 1, "title", "Dashboard", "description", "Main dashboard view", "icon", "dashboard"),
            Map.of("id", 2, "title", "Users", "description", "User management", "icon", "people"),
            Map.of("id", 3, "title", "Reports", "description", "Analytics and reports", "icon", "analytics"),
            Map.of("id", 4, "title", "Settings", "description", "Application settings", "icon", "settings")
        );
        return ResponseEntity.ok(listItems);
    }

    // Select options endpoints - used by dropdown/select components
    @GetMapping("/select-options")
    public ResponseEntity<List<Map<String, Object>>> getSelectOptions() {
        List<Map<String, Object>> options = List.of(
            Map.of("value", "option1", "label", "Option 1"),
            Map.of("value", "option2", "label", "Option 2"),
            Map.of("value", "option3", "label", "Option 3"),
            Map.of("value", "option4", "label", "Option 4")
        );
        return ResponseEntity.ok(options);
    }

    // Chart data endpoints - used by chart components
    @GetMapping("/chart-data")
    public ResponseEntity<Map<String, Object>> getChartData() {
        Map<String, Object> chartData = Map.of(
            "labels", List.of("January", "February", "March", "April", "May", "June"),
            "datasets", List.of(
                Map.of(
                    "label", "Sales",
                    "data", List.of(12, 19, 3, 5, 2, 3),
                    "backgroundColor", "rgba(54, 162, 235, 0.2)",
                    "borderColor", "rgba(54, 162, 235, 1)"
                ),
                Map.of(
                    "label", "Revenue",
                    "data", List.of(2, 3, 20, 5, 1, 4),
                    "backgroundColor", "rgba(255, 99, 132, 0.2)",
                    "borderColor", "rgba(255, 99, 132, 1)"
                )
            )
        );
        return ResponseEntity.ok(chartData);
    }

    // Generic user data endpoints
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> users = List.of(
            Map.of("id", 1, "name", "John Doe", "email", "john@example.com", "role", "Admin"),
            Map.of("id", 2, "name", "Jane Smith", "email", "jane@example.com", "role", "User"),
            Map.of("id", 3, "name", "Bob Johnson", "email", "bob@example.com", "role", "User")
        );
        return ResponseEntity.ok(users);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getProducts() {
        List<Map<String, Object>> products = List.of(
            Map.of("id", 1, "name", "Product A", "price", 29.99, "category", "Electronics"),
            Map.of("id", 2, "name", "Product B", "price", 39.99, "category", "Clothing"),
            Map.of("id", 3, "name", "Product C", "price", 19.99, "category", "Books")
        );
        return ResponseEntity.ok(products);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getOrders() {
        List<Map<String, Object>> orders = List.of(
            Map.of("id", 1, "user_id", 1, "total", 99.99, "status", "Completed"),
            Map.of("id", 2, "user_id", 2, "total", 149.99, "status", "Pending"),
            Map.of("id", 3, "user_id", 1, "total", 79.99, "status", "Shipped")
        );
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        List<Map<String, Object>> categories = List.of(
            Map.of("id", 1, "name", "Electronics", "count", 25),
            Map.of("id", 2, "name", "Clothing", "count", 15),
            Map.of("id", 3, "name", "Books", "count", 40),
            Map.of("id", 4, "name", "Home & Garden", "count", 30)
        );
        return ResponseEntity.ok(categories);
    }
}
