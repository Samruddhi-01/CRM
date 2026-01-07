package com.startica.privateapp.search.controller;

import com.startica.privateapp.search.dto.GlobalSearchRequest;
import com.startica.privateapp.search.dto.GlobalSearchResponse;
import com.startica.privateapp.search.service.GlobalSearchService;
import com.startica.privateapp.model.User;
import com.startica.privateapp.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlobalSearchController {

    private final GlobalSearchService globalSearchService;
    private final AuthService authService;

    @PostMapping("/global")
    public ResponseEntity<GlobalSearchResponse> globalSearch(@Valid @RequestBody GlobalSearchRequest request) {
        User currentUser = authService.getCurrentUser();
        GlobalSearchResponse response = globalSearchService.search(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/candidates")
    public ResponseEntity<?> advancedCandidateSearch(@RequestBody Map<String, Object> searchRequest) {
        try {
            System.out.println("=== Advanced Search Request Received ===");
            System.out.println("Request payload: " + searchRequest);
            
            User currentUser = authService.getCurrentUser();
            System.out.println("Current user: " + (currentUser != null ? currentUser.getEmail() : "null"));
            
            // Extract search parameters
            String query = (String) searchRequest.getOrDefault("query", "");
            Map<String, Object> filters = (Map<String, Object>) searchRequest.getOrDefault("filters", new HashMap<>());
            String sortBy = (String) searchRequest.getOrDefault("sortBy", "relevance");
            int page = (int) searchRequest.getOrDefault("page", 1);
            int limit = (int) searchRequest.getOrDefault("limit", 20);
            
            System.out.println("📥 Search Request:");
            System.out.println("   Query: '" + query + "'");
            System.out.println("   Filters: " + filters.keySet());
            System.out.println("   Sort: " + sortBy);
            System.out.println("   📄 Page: " + page + ", Limit: " + limit);
            
            // Call search service with advanced filters
            Map<String, Object> response = globalSearchService.advancedCandidateSearch(
                query, filters, sortBy, page, limit, currentUser
            );
            
            System.out.println("Search completed. Results count: " + response.get("totalCount"));
            System.out.println("=== End Advanced Search ===");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== Advanced Search Error ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Search failed: " + e.getMessage()));
        }
    }
}
