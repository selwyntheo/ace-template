package com.ace.templateengine.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "designs")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Design {
    
    @Id
    private String id;
    
    @NotBlank(message = "Design name is required")
    @Field("name")
    private String name;
    
    @Field("description")
    private String description;
    
    @NotNull(message = "Canvas configuration is required")
    @Field("canvas_config")
    private CanvasConfig canvasConfig;
    
    @Field("components")
    private List<DesignComponent> components;
    
    @Field("global_styles")
    private Map<String, Object> globalStyles;
    
    @Field("theme_settings")
    private ThemeSettings themeSettings;
    
    @Field("metadata")
    private DesignMetadata metadata;
    
    @Field("version")
    private String version = "1.0.0";
    
    @Field("status")
    private DesignStatus status = DesignStatus.DRAFT;
    
    @Field("tags")
    private List<String> tags;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    @Field("created_by")
    private String createdBy;
    
    @Field("updated_by")
    private String updatedBy;
    
    @Field("is_public")
    private Boolean isPublic = false;
    
    @Field("preview_image")
    private String previewImage;
    
    // Constructors
    public Design() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Design(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public CanvasConfig getCanvasConfig() { return canvasConfig; }
    public void setCanvasConfig(CanvasConfig canvasConfig) { this.canvasConfig = canvasConfig; }
    
    public List<DesignComponent> getComponents() { return components; }
    public void setComponents(List<DesignComponent> components) { this.components = components; }
    
    public Map<String, Object> getGlobalStyles() { return globalStyles; }
    public void setGlobalStyles(Map<String, Object> globalStyles) { this.globalStyles = globalStyles; }
    
    public ThemeSettings getThemeSettings() { return themeSettings; }
    public void setThemeSettings(ThemeSettings themeSettings) { this.themeSettings = themeSettings; }
    
    public DesignMetadata getMetadata() { return metadata; }
    public void setMetadata(DesignMetadata metadata) { this.metadata = metadata; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public DesignStatus getStatus() { return status; }
    public void setStatus(DesignStatus status) { this.status = status; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public String getPreviewImage() { return previewImage; }
    public void setPreviewImage(String previewImage) { this.previewImage = previewImage; }
    
    // Nested classes for complex properties
    public static class CanvasConfig {
        private Integer width;
        private Integer height;
        private String backgroundColor;
        private Integer gridSize;
        private Boolean showGrid;
        private Integer zoomLevel;
        private String orientation;
        
        // Constructors, getters and setters
        public CanvasConfig() {}
        
        public Integer getWidth() { return width; }
        public void setWidth(Integer width) { this.width = width; }
        
        public Integer getHeight() { return height; }
        public void setHeight(Integer height) { this.height = height; }
        
        public String getBackgroundColor() { return backgroundColor; }
        public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
        
        public Integer getGridSize() { return gridSize; }
        public void setGridSize(Integer gridSize) { this.gridSize = gridSize; }
        
        public Boolean getShowGrid() { return showGrid; }
        public void setShowGrid(Boolean showGrid) { this.showGrid = showGrid; }
        
        public Integer getZoomLevel() { return zoomLevel; }
        public void setZoomLevel(Integer zoomLevel) { this.zoomLevel = zoomLevel; }
        
        public String getOrientation() { return orientation; }
        public void setOrientation(String orientation) { this.orientation = orientation; }
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DesignComponent {
        private String id;
        private String type;
        private String name;
        private Map<String, Object> properties;
        private Map<String, Object> styles;
        private Map<String, Object> position;
        private Map<String, Object> size;
        private List<String> children;
        private String parentId;
        private Integer zIndex;
        private Boolean visible;
        private Boolean locked;
        
        // Constructors, getters and setters
        public DesignComponent() {}
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Map<String, Object> getProperties() { return properties; }
        public void setProperties(Map<String, Object> properties) { this.properties = properties; }
        
        public Map<String, Object> getStyles() { return styles; }
        public void setStyles(Map<String, Object> styles) { this.styles = styles; }
        
        public Map<String, Object> getPosition() { return position; }
        public void setPosition(Map<String, Object> position) { this.position = position; }
        
        public Map<String, Object> getSize() { return size; }
        public void setSize(Map<String, Object> size) { this.size = size; }
        
        public List<String> getChildren() { return children; }
        public void setChildren(List<String> children) { this.children = children; }
        
        public String getParentId() { return parentId; }
        public void setParentId(String parentId) { this.parentId = parentId; }
        
        public Integer getZIndex() { return zIndex; }
        public void setZIndex(Integer zIndex) { this.zIndex = zIndex; }
        
        public Boolean getVisible() { return visible; }
        public void setVisible(Boolean visible) { this.visible = visible; }
        
        public Boolean getLocked() { return locked; }
        public void setLocked(Boolean locked) { this.locked = locked; }
    }
    
    public static class ThemeSettings {
        private String primaryColor;
        private String secondaryColor;
        private String backgroundColor;
        private String textColor;
        private String fontFamily;
        private String fontSize;
        private String fontWeight;
        private String borderRadius;
        private String spacing;
        private String shadowStyle;
        
        // Constructors, getters and setters
        public ThemeSettings() {}
        
        public String getPrimaryColor() { return primaryColor; }
        public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
        
        public String getSecondaryColor() { return secondaryColor; }
        public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }
        
        public String getBackgroundColor() { return backgroundColor; }
        public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
        
        public String getTextColor() { return textColor; }
        public void setTextColor(String textColor) { this.textColor = textColor; }
        
        public String getFontFamily() { return fontFamily; }
        public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }
        
        public String getFontSize() { return fontSize; }
        public void setFontSize(String fontSize) { this.fontSize = fontSize; }
        
        public String getFontWeight() { return fontWeight; }
        public void setFontWeight(String fontWeight) { this.fontWeight = fontWeight; }
        
        public String getBorderRadius() { return borderRadius; }
        public void setBorderRadius(String borderRadius) { this.borderRadius = borderRadius; }
        
        public String getSpacing() { return spacing; }
        public void setSpacing(String spacing) { this.spacing = spacing; }
        
        public String getShadowStyle() { return shadowStyle; }
        public void setShadowStyle(String shadowStyle) { this.shadowStyle = shadowStyle; }
    }
    
    public static class DesignMetadata {
        private String category;
        private String difficulty;
        private List<String> requiredFeatures;
        private Map<String, Object> customFields;
        private String exportFormat;
        private String targetPlatform;
        
        // Constructors, getters and setters
        public DesignMetadata() {}
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
        
        public List<String> getRequiredFeatures() { return requiredFeatures; }
        public void setRequiredFeatures(List<String> requiredFeatures) { this.requiredFeatures = requiredFeatures; }
        
        public Map<String, Object> getCustomFields() { return customFields; }
        public void setCustomFields(Map<String, Object> customFields) { this.customFields = customFields; }
        
        public String getExportFormat() { return exportFormat; }
        public void setExportFormat(String exportFormat) { this.exportFormat = exportFormat; }
        
        public String getTargetPlatform() { return targetPlatform; }
        public void setTargetPlatform(String targetPlatform) { this.targetPlatform = targetPlatform; }
    }
    
    public enum DesignStatus {
        DRAFT, PUBLISHED, ARCHIVED, UNDER_REVIEW
    }
}
