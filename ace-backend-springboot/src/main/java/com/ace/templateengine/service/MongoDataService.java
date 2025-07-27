package com.ace.templateengine.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MongoDataService {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Get all collection names in the database
     */
    public Set<String> getAllCollectionNames() {
        return mongoTemplate.getCollectionNames();
    }

    /**
     * Check if a collection exists
     */
    public boolean collectionExists(String collectionName) {
        return mongoTemplate.collectionExists(collectionName);
    }

    /**
     * Get all data from a collection with pagination and sorting
     */
    public List<Map<String, Object>> getCollectionData(String collectionName, 
                                                      int page, int limit, 
                                                      String sortBy, String sortOrder) {
        Query query = new Query();
        
        // Add pagination
        query.skip(page * limit).limit(limit);
        
        // Add sorting if specified
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            if ("desc".equalsIgnoreCase(sortOrder)) {
                query.with(org.springframework.data.domain.Sort.by(sortBy).descending());
            } else {
                query.with(org.springframework.data.domain.Sort.by(sortBy).ascending());
            }
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) (List<?>) 
                mongoTemplate.find(query, Map.class, collectionName);
        
        return results;
    }

    /**
     * Get all data from a collection (simple version)
     */
    public List<Map<String, Object>> getAllCollectionData(String collectionName) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) (List<?>) 
                mongoTemplate.findAll(Map.class, collectionName);
        return results;
    }

    /**
     * Get total count of documents in a collection
     */
    public long getCollectionCount(String collectionName) {
        return mongoTemplate.count(new Query(), collectionName);
    }

    /**
     * Search data in a collection with filters
     */
    public List<Map<String, Object>> searchCollectionData(String collectionName, 
                                                         Map<String, Object> searchCriteria,
                                                         int page, int limit) {
        Query query = buildSearchQuery(searchCriteria);
        query.skip(page * limit).limit(limit);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) (List<?>) 
                mongoTemplate.find(query, Map.class, collectionName);
        
        return results;
    }

    /**
     * Get count for search results
     */
    public long getSearchCount(String collectionName, Map<String, Object> searchCriteria) {
        Query query = buildSearchQuery(searchCriteria);
        return mongoTemplate.count(query, collectionName);
    }

    /**
     * Get collection schema by analyzing sample documents
     */
    public Map<String, Object> getCollectionSchema(String collectionName, int sampleSize) {
        Query query = new Query().limit(sampleSize);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> sampleDocs = (List<Map<String, Object>>) (List<?>) 
                mongoTemplate.find(query, Map.class, collectionName);
        
        Map<String, Map<String, Object>> schema = new HashMap<>();
        Set<String> allFields = new HashSet<>();
        
        for (Map<String, Object> doc : sampleDocs) {
            analyzeDocument(doc, allFields, schema, "");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("fields", allFields.stream().sorted().collect(Collectors.toList()));
        result.put("schema", schema);
        result.put("sampleSize", sampleDocs.size());
        
        return result;
    }

    /**
     * Get distinct values for a field in a collection
     */
    public List<Object> getDistinctValues(String collectionName, String fieldName) {
        return mongoTemplate.getCollection(collectionName)
                .distinct(fieldName, Object.class)
                .into(new ArrayList<>());
    }

    /**
     * Execute aggregation pipeline
     */
    public List<Map<String, Object>> executeAggregation(String collectionName, 
                                                       List<Map<String, Object>> pipeline) {
        // This would require more complex implementation for dynamic aggregation
        // For now, return empty list
        return new ArrayList<>();
    }

    /**
     * Build search query from criteria map
     */
    private Query buildSearchQuery(Map<String, Object> searchCriteria) {
        Query query = new Query();
        
        if (searchCriteria != null && !searchCriteria.isEmpty()) {
            for (Map.Entry<String, Object> entry : searchCriteria.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                
                if (value instanceof String && ((String) value).contains("*")) {
                    // Wildcard search
                    String pattern = ((String) value).replace("*", ".*");
                    query.addCriteria(Criteria.where(key).regex(pattern, "i"));
                } else if (value instanceof Map) {
                    // Range or complex queries
                    @SuppressWarnings("unchecked")
                    Map<String, Object> criteriaMap = (Map<String, Object>) value;
                    Criteria criteria = Criteria.where(key);
                    
                    for (Map.Entry<String, Object> criteriaEntry : criteriaMap.entrySet()) {
                        switch (criteriaEntry.getKey()) {
                            case "$gt":
                                criteria = criteria.gt(criteriaEntry.getValue());
                                break;
                            case "$gte":
                                criteria = criteria.gte(criteriaEntry.getValue());
                                break;
                            case "$lt":
                                criteria = criteria.lt(criteriaEntry.getValue());
                                break;
                            case "$lte":
                                criteria = criteria.lte(criteriaEntry.getValue());
                                break;
                            case "$in":
                                if (criteriaEntry.getValue() instanceof List) {
                                    criteria = criteria.in((List<?>) criteriaEntry.getValue());
                                }
                                break;
                            case "$nin":
                                if (criteriaEntry.getValue() instanceof List) {
                                    criteria = criteria.nin((List<?>) criteriaEntry.getValue());
                                }
                                break;
                            case "$regex":
                                criteria = criteria.regex((String) criteriaEntry.getValue(), "i");
                                break;
                            case "$exists":
                                criteria = criteria.exists((Boolean) criteriaEntry.getValue());
                                break;
                        }
                    }
                    query.addCriteria(criteria);
                } else {
                    // Exact match
                    query.addCriteria(Criteria.where(key).is(value));
                }
            }
        }
        
        return query;
    }

    /**
     * Analyze document structure recursively
     */
    private void analyzeDocument(Map<String, Object> doc, Set<String> allFields, 
                               Map<String, Map<String, Object>> schema, String prefix) {
        for (Map.Entry<String, Object> entry : doc.entrySet()) {
            String fieldName = prefix.isEmpty() ? entry.getKey() : prefix + "." + entry.getKey();
            allFields.add(fieldName);
            
            Object value = entry.getValue();
            Map<String, Object> fieldInfo = schema.computeIfAbsent(fieldName, k -> new HashMap<>());
            
            String type = value == null ? "null" : value.getClass().getSimpleName();
            fieldInfo.put("type", type);
            
            // Add more detailed type information
            if (value instanceof Number) {
                fieldInfo.put("numeric", true);
            } else if (value instanceof String) {
                fieldInfo.put("maxLength", Math.max(
                    (Integer) fieldInfo.getOrDefault("maxLength", 0), 
                    ((String) value).length()
                ));
            } else if (value instanceof Date) {
                fieldInfo.put("dateField", true);
            } else if (value instanceof Boolean) {
                fieldInfo.put("booleanField", true);
            }
            
            // Handle nested objects
            if (value instanceof Map) {
                fieldInfo.put("nested", true);
                @SuppressWarnings("unchecked")
                Map<String, Object> nestedDoc = (Map<String, Object>) value;
                analyzeDocument(nestedDoc, allFields, schema, fieldName);
            } else if (value instanceof List) {
                fieldInfo.put("array", true);
                List<?> list = (List<?>) value;
                if (!list.isEmpty()) {
                    fieldInfo.put("arraySize", list.size());
                    if (list.get(0) instanceof Map) {
                        fieldInfo.put("arrayOfObjects", true);
                        @SuppressWarnings("unchecked")
                        Map<String, Object> nestedDoc = (Map<String, Object>) list.get(0);
                        analyzeDocument(nestedDoc, allFields, schema, fieldName);
                    }
                }
            }
        }
    }
}
