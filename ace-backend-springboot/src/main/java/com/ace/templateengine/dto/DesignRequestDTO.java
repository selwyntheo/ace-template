package com.ace.templateengine.dto;

import com.ace.templateengine.model.Design;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DesignRequestDTO {
    
    @NotBlank(message = "Design name is required")
    private String name;
    
    private String description;
    private Design.CanvasConfig canvasConfig;
    private List<Design.DesignComponent> components;
    private Map<String, Object> globalStyles;
    private Design.ThemeSettings themeSettings;
    private Design.DesignMetadata metadata;
    private String version;
    private Design.DesignStatus status;
    private List<String> tags;
    private Boolean isPublic;
    private String previewImage;
    
    // Constructors
    public DesignRequestDTO() {}
    
    // Convert to Design entity
    public Design toDesign(String createdBy) {
        Design design = new Design();
        design.setName(this.name);
        design.setDescription(this.description);
        design.setCanvasConfig(this.canvasConfig);
        design.setComponents(this.components);
        design.setGlobalStyles(this.globalStyles);
        design.setThemeSettings(this.themeSettings);
        design.setMetadata(this.metadata);
        design.setVersion(this.version != null ? this.version : "1.0.0");
        design.setStatus(this.status != null ? this.status : Design.DesignStatus.DRAFT);
        design.setTags(this.tags);
        design.setCreatedBy(createdBy);
        design.setUpdatedBy(createdBy);
        design.setIsPublic(this.isPublic != null ? this.isPublic : false);
        design.setPreviewImage(this.previewImage);
        design.setCreatedAt(LocalDateTime.now());
        design.setUpdatedAt(LocalDateTime.now());
        return design;
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Design.CanvasConfig getCanvasConfig() { return canvasConfig; }
    public void setCanvasConfig(Design.CanvasConfig canvasConfig) { this.canvasConfig = canvasConfig; }
    
    public List<Design.DesignComponent> getComponents() { return components; }
    public void setComponents(List<Design.DesignComponent> components) { this.components = components; }
    
    public Map<String, Object> getGlobalStyles() { return globalStyles; }
    public void setGlobalStyles(Map<String, Object> globalStyles) { this.globalStyles = globalStyles; }
    
    public Design.ThemeSettings getThemeSettings() { return themeSettings; }
    public void setThemeSettings(Design.ThemeSettings themeSettings) { this.themeSettings = themeSettings; }
    
    public Design.DesignMetadata getMetadata() { return metadata; }
    public void setMetadata(Design.DesignMetadata metadata) { this.metadata = metadata; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public Design.DesignStatus getStatus() { return status; }
    public void setStatus(Design.DesignStatus status) { this.status = status; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public String getPreviewImage() { return previewImage; }
    public void setPreviewImage(String previewImage) { this.previewImage = previewImage; }
}
