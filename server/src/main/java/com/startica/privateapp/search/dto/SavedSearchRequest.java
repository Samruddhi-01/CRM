package com.startica.privateapp.search.dto;

import lombok.Data;
import lombok.Builder;
import java.util.Map;

@Data
@Builder
public class SavedSearchRequest {
    // Basic info
    private String name;
    private String description;
    
    // Search configuration
    private String searchType; // CANDIDATE, JOB_OPENING, GLOBAL
    private Map<String, Object> filters; // JSON object with all filter values
    
    // Sharing
    private boolean isShared; // If true, visible to all users with appropriate role
    
    // Notifications
    private boolean enableNotifications; // Send alerts when new matches found
    private Integer notificationFrequency; // In hours
}
