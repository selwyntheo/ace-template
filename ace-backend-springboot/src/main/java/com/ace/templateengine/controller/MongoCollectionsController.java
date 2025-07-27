package com.ace.templateengine.controller;

import com.ace.templateengine.service.MongoDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mongo")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class MongoCollectionsController {

    @Autowired
    private MongoDataService mongoDataService;

    /**
     * Get all collections in the database
     */
    @GetMapping("/collections")
    public ResponseEntity<Map<String, Object>> getAllCollections() {
        try {
            Set<String> collectionNames = mongoDataService.getAllCollectionNames();
            Map<String, Object> response = new HashMap<>();
            response.put("collections", collectionNames);
            response.put("count", collectionNames.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch collections", "message", e.getMessage()));
        }
    }

    /**
     * Get all data from a specific collection
     */
    @GetMapping("/collections/{collectionName}")
    public ResponseEntity<Map<String, Object>> getCollectionData(
            @PathVariable String collectionName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Collection not found", "collection", collectionName));
            }

            List<Map<String, Object>> results = mongoDataService.getCollectionData(
                collectionName, page, limit, sortBy, sortOrder);
            
            long totalCount = mongoDataService.getCollectionCount(collectionName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", results);
            response.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", totalCount,
                "totalPages", (totalCount + limit - 1) / limit
            ));
            response.put("collection", collectionName);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch data", "message", e.getMessage()));
        }
    }

    /**
     * Get all data from a collection (simple version for backward compatibility)
     */
    @GetMapping("/collections/{collectionName}/all")
    public ResponseEntity<List<Map<String, Object>>> getAllCollectionData(@PathVariable String collectionName) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            List<Map<String, Object>> results = mongoDataService.getAllCollectionData(collectionName);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Search data in a collection with filters
     */
    @PostMapping("/collections/{collectionName}/search")
    public ResponseEntity<Map<String, Object>> searchCollectionData(
            @PathVariable String collectionName,
            @RequestBody Map<String, Object> searchCriteria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Collection not found", "collection", collectionName));
            }

            List<Map<String, Object>> results = mongoDataService.searchCollectionData(
                collectionName, searchCriteria, page, limit);
            
            long totalCount = mongoDataService.getSearchCount(collectionName, searchCriteria);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", results);
            response.put("searchCriteria", searchCriteria);
            response.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", totalCount,
                "totalPages", (totalCount + limit - 1) / limit
            ));
            response.put("collection", collectionName);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to search data", "message", e.getMessage()));
        }
    }

    /**
     * Get collection schema/structure
     */
    @GetMapping("/collections/{collectionName}/schema")
    public ResponseEntity<Map<String, Object>> getCollectionSchema(
            @PathVariable String collectionName,
            @RequestParam(defaultValue = "100") int sampleSize) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Collection not found", "collection", collectionName));
            }

            Map<String, Object> schemaInfo = mongoDataService.getCollectionSchema(collectionName, sampleSize);
            
            Map<String, Object> response = new HashMap<>();
            response.put("collection", collectionName);
            response.putAll(schemaInfo);
            response.put("totalDocuments", mongoDataService.getCollectionCount(collectionName));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to analyze schema", "message", e.getMessage()));
        }
    }

    /**
     * Get statistics for a collection
     */
    @GetMapping("/collections/{collectionName}/stats")
    public ResponseEntity<Map<String, Object>> getCollectionStats(@PathVariable String collectionName) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Collection not found", "collection", collectionName));
            }

            long totalCount = mongoDataService.getCollectionCount(collectionName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("collection", collectionName);
            response.put("totalDocuments", totalCount);
            response.put("exists", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get stats", "message", e.getMessage()));
        }
    }

    /**
     * Get distinct values for a field in a collection
     */
    @GetMapping("/collections/{collectionName}/distinct/{fieldName}")
    public ResponseEntity<Map<String, Object>> getDistinctValues(
            @PathVariable String collectionName,
            @PathVariable String fieldName) {
        try {
            if (!mongoDataService.collectionExists(collectionName)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Collection not found", "collection", collectionName));
            }

            List<Object> distinctValues = mongoDataService.getDistinctValues(collectionName, fieldName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("collection", collectionName);
            response.put("field", fieldName);
            response.put("values", distinctValues);
            response.put("count", distinctValues.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get distinct values", "message", e.getMessage()));
        }
    }

    /**
     * Legacy endpoints for backward compatibility - Financial Data Collections
     */
    @GetMapping("/account-balances")
    public ResponseEntity<List<Map<String, Object>>> getAccountBalances() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("account_balances"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/chart-of-accounts")
    public ResponseEntity<List<Map<String, Object>>> getChartOfAccounts() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("chart_of_accounts"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/distributions")
    public ResponseEntity<List<Map<String, Object>>> getDistributions() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("distributions"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/fund-info")
    public ResponseEntity<List<Map<String, Object>>> getFundInfo() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("fund_info"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/journal-entries")
    public ResponseEntity<List<Map<String, Object>>> getJournalEntries() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("journal_entries"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/nav-history")
    public ResponseEntity<List<Map<String, Object>>> getNavHistory() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("nav_history"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/share-transactions")
    public ResponseEntity<List<Map<String, Object>>> getShareTransactions() {
        try {
            return ResponseEntity.ok(mongoDataService.getAllCollectionData("share_transactions"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
