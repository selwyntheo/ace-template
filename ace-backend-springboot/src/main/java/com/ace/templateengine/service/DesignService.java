package com.ace.templateengine.service;

import com.ace.templateengine.model.Design;
import com.ace.templateengine.repository.DesignRepository;
import com.ace.templateengine.exception.DesignNotFoundException;
import com.ace.templateengine.exception.DuplicateDesignNameException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DesignService {
    
    @Autowired
    private DesignRepository designRepository;
    
    // Create a new design
    public Design createDesign(Design design) {
        // Check for duplicate name for the same user
        if (design.getCreatedBy() != null && 
            designRepository.existsByNameIgnoreCaseAndCreatedBy(design.getName(), design.getCreatedBy())) {
            throw new DuplicateDesignNameException("Design with name '" + design.getName() + "' already exists for this user");
        }
        
        design.setCreatedAt(LocalDateTime.now());
        design.setUpdatedAt(LocalDateTime.now());
        
        // Set default values if not provided
        if (design.getStatus() == null) {
            design.setStatus(Design.DesignStatus.DRAFT);
        }
        if (design.getVersion() == null) {
            design.setVersion("1.0.0");
        }
        if (design.getIsPublic() == null) {
            design.setIsPublic(false);
        }
        
        return designRepository.save(design);
    }
    
    // Get all designs with pagination
    public Page<Design> getAllDesigns(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return designRepository.findAll(pageable);
    }
    
    // Get all designs (without pagination)
    public List<Design> getAllDesigns() {
        return designRepository.findAll();
    }
    
    // Get design by ID
    public Design getDesignById(String id) {
        return designRepository.findById(id)
                .orElseThrow(() -> new DesignNotFoundException("Design not found with id: " + id));
    }
    
    // Get designs by creator
    public List<Design> getDesignsByCreator(String createdBy) {
        return designRepository.findByCreatedBy(createdBy);
    }
    
    // Get designs by creator with pagination
    public Page<Design> getDesignsByCreator(String createdBy, int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return designRepository.findByCreatedBy(createdBy, pageable);
    }
    
    // Update design
    public Design updateDesign(String id, Design updatedDesign) {
        Design existingDesign = getDesignById(id);
        
        // Check for duplicate name if name is being changed
        if (!existingDesign.getName().equalsIgnoreCase(updatedDesign.getName()) &&
            updatedDesign.getCreatedBy() != null &&
            designRepository.existsByNameIgnoreCaseAndCreatedBy(updatedDesign.getName(), updatedDesign.getCreatedBy())) {
            throw new DuplicateDesignNameException("Design with name '" + updatedDesign.getName() + "' already exists for this user");
        }
        
        // Update fields
        existingDesign.setName(updatedDesign.getName());
        existingDesign.setDescription(updatedDesign.getDescription());
        existingDesign.setCanvasConfig(updatedDesign.getCanvasConfig());
        existingDesign.setComponents(updatedDesign.getComponents());
        existingDesign.setGlobalStyles(updatedDesign.getGlobalStyles());
        existingDesign.setThemeSettings(updatedDesign.getThemeSettings());
        existingDesign.setMetadata(updatedDesign.getMetadata());
        existingDesign.setVersion(updatedDesign.getVersion());
        existingDesign.setStatus(updatedDesign.getStatus());
        existingDesign.setTags(updatedDesign.getTags());
        existingDesign.setUpdatedBy(updatedDesign.getUpdatedBy());
        existingDesign.setIsPublic(updatedDesign.getIsPublic());
        existingDesign.setPreviewImage(updatedDesign.getPreviewImage());
        existingDesign.setUpdatedAt(LocalDateTime.now());
        
        return designRepository.save(existingDesign);
    }
    
    // Partially update design
    public Design patchDesign(String id, Design partialDesign) {
        Design existingDesign = getDesignById(id);
        
        // Update only non-null fields
        if (partialDesign.getName() != null) {
            // Check for duplicate name if name is being changed
            if (!existingDesign.getName().equalsIgnoreCase(partialDesign.getName()) &&
                partialDesign.getCreatedBy() != null &&
                designRepository.existsByNameIgnoreCaseAndCreatedBy(partialDesign.getName(), partialDesign.getCreatedBy())) {
                throw new DuplicateDesignNameException("Design with name '" + partialDesign.getName() + "' already exists for this user");
            }
            existingDesign.setName(partialDesign.getName());
        }
        if (partialDesign.getDescription() != null) {
            existingDesign.setDescription(partialDesign.getDescription());
        }
        if (partialDesign.getCanvasConfig() != null) {
            existingDesign.setCanvasConfig(partialDesign.getCanvasConfig());
        }
        if (partialDesign.getComponents() != null) {
            existingDesign.setComponents(partialDesign.getComponents());
        }
        if (partialDesign.getGlobalStyles() != null) {
            existingDesign.setGlobalStyles(partialDesign.getGlobalStyles());
        }
        if (partialDesign.getThemeSettings() != null) {
            existingDesign.setThemeSettings(partialDesign.getThemeSettings());
        }
        if (partialDesign.getMetadata() != null) {
            existingDesign.setMetadata(partialDesign.getMetadata());
        }
        if (partialDesign.getVersion() != null) {
            existingDesign.setVersion(partialDesign.getVersion());
        }
        if (partialDesign.getStatus() != null) {
            existingDesign.setStatus(partialDesign.getStatus());
        }
        if (partialDesign.getTags() != null) {
            existingDesign.setTags(partialDesign.getTags());
        }
        if (partialDesign.getUpdatedBy() != null) {
            existingDesign.setUpdatedBy(partialDesign.getUpdatedBy());
        }
        if (partialDesign.getIsPublic() != null) {
            existingDesign.setIsPublic(partialDesign.getIsPublic());
        }
        if (partialDesign.getPreviewImage() != null) {
            existingDesign.setPreviewImage(partialDesign.getPreviewImage());
        }
        
        existingDesign.setUpdatedAt(LocalDateTime.now());
        
        return designRepository.save(existingDesign);
    }
    
    // Delete design
    public void deleteDesign(String id) {
        Design design = getDesignById(id);
        designRepository.delete(design);
    }
    
    // Search designs by name or description
    public List<Design> searchDesigns(String searchTerm) {
        return designRepository.findByNameOrDescriptionContainingIgnoreCase(searchTerm);
    }
    
    // Get designs by status
    public List<Design> getDesignsByStatus(Design.DesignStatus status) {
        return designRepository.findByStatus(status);
    }
    
    // Get public designs
    public List<Design> getPublicDesigns() {
        return designRepository.findByIsPublicTrue();
    }
    
    // Get designs by tag
    public List<Design> getDesignsByTag(String tag) {
        return designRepository.findByTagsContaining(tag);
    }
    
    // Get designs by multiple tags (must have all tags)
    public List<Design> getDesignsByAllTags(List<String> tags) {
        return designRepository.findByAllTags(tags);
    }
    
    // Get designs by category
    public List<Design> getDesignsByCategory(String category) {
        return designRepository.findByCategory(category);
    }
    
    // Get designs by component types
    public List<Design> getDesignsByComponentTypes(List<String> componentTypes) {
        return designRepository.findByComponentTypes(componentTypes);
    }
    
    // Get designs created within date range
    public List<Design> getDesignsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return designRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    // Get designs updated after a specific date
    public List<Design> getDesignsUpdatedAfter(LocalDateTime date) {
        return designRepository.findByUpdatedAtAfter(date);
    }
    
    // Clone/duplicate a design
    public Design cloneDesign(String id, String newName, String createdBy) {
        Design originalDesign = getDesignById(id);
        
        // Check if new name already exists for the user
        if (designRepository.existsByNameIgnoreCaseAndCreatedBy(newName, createdBy)) {
            throw new DuplicateDesignNameException("Design with name '" + newName + "' already exists for this user");
        }
        
        Design clonedDesign = new Design();
        clonedDesign.setName(newName);
        clonedDesign.setDescription("Copy of " + originalDesign.getDescription());
        clonedDesign.setCanvasConfig(originalDesign.getCanvasConfig());
        clonedDesign.setComponents(originalDesign.getComponents());
        clonedDesign.setGlobalStyles(originalDesign.getGlobalStyles());
        clonedDesign.setThemeSettings(originalDesign.getThemeSettings());
        clonedDesign.setMetadata(originalDesign.getMetadata());
        clonedDesign.setVersion("1.0.0"); // Reset version for cloned design
        clonedDesign.setStatus(Design.DesignStatus.DRAFT); // Reset status to draft
        clonedDesign.setTags(originalDesign.getTags());
        clonedDesign.setCreatedBy(createdBy);
        clonedDesign.setUpdatedBy(createdBy);
        clonedDesign.setIsPublic(false); // Make cloned design private by default
        clonedDesign.setCreatedAt(LocalDateTime.now());
        clonedDesign.setUpdatedAt(LocalDateTime.now());
        
        return designRepository.save(clonedDesign);
    }
    
    // Get design statistics
    public DesignStats getDesignStats() {
        long totalDesigns = designRepository.count();
        long publicDesigns = designRepository.countByIsPublicTrue();
        
        DesignStats stats = new DesignStats();
        stats.setTotalDesigns(totalDesigns);
        stats.setPublicDesigns(publicDesigns);
        stats.setPrivateDesigns(totalDesigns - publicDesigns);
        
        return stats;
    }
    
    // Get design statistics for a specific user
    public DesignStats getDesignStatsByUser(String createdBy) {
        long totalDesigns = designRepository.countByCreatedBy(createdBy);
        List<Design> userDesigns = designRepository.findByCreatedBy(createdBy);
        long publicDesigns = userDesigns.stream()
                .mapToLong(design -> design.getIsPublic() ? 1 : 0)
                .sum();
        
        DesignStats stats = new DesignStats();
        stats.setTotalDesigns(totalDesigns);
        stats.setPublicDesigns(publicDesigns);
        stats.setPrivateDesigns(totalDesigns - publicDesigns);
        
        return stats;
    }
    
    // Inner class for design statistics
    public static class DesignStats {
        private long totalDesigns;
        private long publicDesigns;
        private long privateDesigns;
        
        // Getters and setters
        public long getTotalDesigns() { return totalDesigns; }
        public void setTotalDesigns(long totalDesigns) { this.totalDesigns = totalDesigns; }
        
        public long getPublicDesigns() { return publicDesigns; }
        public void setPublicDesigns(long publicDesigns) { this.publicDesigns = publicDesigns; }
        
        public long getPrivateDesigns() { return privateDesigns; }
        public void setPrivateDesigns(long privateDesigns) { this.privateDesigns = privateDesigns; }
    }
}
