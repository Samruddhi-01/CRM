package com.startica.privateapp.search.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class SavedSearchResponse {
    private Long id;
    private String name;
    private String description;
    private String searchType;
    private Map<String, Object> filters;
    private boolean isShared;
    private boolean enableNotifications;
    private Integer notificationFrequency;
    
    // Metadata
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;
    private Integer useCount;
}
