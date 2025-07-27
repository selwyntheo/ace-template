package com.ace.templateengine.repository;

import com.ace.templateengine.model.Design;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DesignRepository extends MongoRepository<Design, String> {
    
    // Find by name (case-insensitive)
    Optional<Design> findByNameIgnoreCase(String name);
    
    // Find designs by creator
    List<Design> findByCreatedBy(String createdBy);
    
    // Find designs by status
    List<Design> findByStatus(Design.DesignStatus status);
    
    // Find public designs
    List<Design> findByIsPublicTrue();
    
    // Find designs by tags
    List<Design> findByTagsContaining(String tag);
    
    // Find designs created within a date range
    List<Design> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find designs with pagination and sorting
    Page<Design> findByCreatedBy(String createdBy, Pageable pageable);
    
    // Search designs by name or description (case-insensitive)
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Design> findByNameOrDescriptionContainingIgnoreCase(String searchTerm);
    
    // Find designs by category in metadata
    @Query("{ 'metadata.category': ?0 }")
    List<Design> findByCategory(String category);
    
    // Find designs by version
    List<Design> findByVersion(String version);
    
    // Custom query to find designs with specific component types
    @Query("{ 'components.type': { $in: ?0 } }")
    List<Design> findByComponentTypes(List<String> componentTypes);
    
    // Find designs updated after a specific date
    List<Design> findByUpdatedAtAfter(LocalDateTime date);
    
    // Count designs by creator
    long countByCreatedBy(String createdBy);
    
    // Count public designs
    long countByIsPublicTrue();
    
    // Find designs by multiple tags
    @Query("{ 'tags': { $all: ?0 } }")
    List<Design> findByAllTags(List<String> tags);
    
    // Check if design name exists for a specific user
    boolean existsByNameIgnoreCaseAndCreatedBy(String name, String createdBy);
}
