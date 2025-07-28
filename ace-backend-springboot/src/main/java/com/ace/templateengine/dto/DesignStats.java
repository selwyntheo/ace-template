package com.ace.templateengine.dto;

/**
 * Data Transfer Object for Design Statistics
 */
public class DesignStats {
    private long totalDesigns;
    private long publicDesigns;
    private long privateDesigns;
    
    // Constructors
    public DesignStats() {}
    
    public DesignStats(long totalDesigns, long publicDesigns, long privateDesigns) {
        this.totalDesigns = totalDesigns;
        this.publicDesigns = publicDesigns;
        this.privateDesigns = privateDesigns;
    }
    
    // Getters and setters
    public long getTotalDesigns() { 
        return totalDesigns; 
    }
    
    public void setTotalDesigns(long totalDesigns) { 
        this.totalDesigns = totalDesigns; 
    }
    
    public long getPublicDesigns() { 
        return publicDesigns; 
    }
    
    public void setPublicDesigns(long publicDesigns) { 
        this.publicDesigns = publicDesigns; 
    }
    
    public long getPrivateDesigns() { 
        return privateDesigns; 
    }
    
    public void setPrivateDesigns(long privateDesigns) { 
        this.privateDesigns = privateDesigns; 
    }
}
