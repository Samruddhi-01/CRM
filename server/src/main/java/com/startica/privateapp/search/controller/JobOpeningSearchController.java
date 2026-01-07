package com.startica.privateapp.search.controller;

import com.startica.privateapp.auth.service.AuthService;
import com.startica.privateapp.model.User;
import com.startica.privateapp.search.dto.JobOpeningSearchRequest;
import com.startica.privateapp.search.dto.SearchResultPage;
import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.search.service.JobOpeningSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/openings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobOpeningSearchController {

    private final JobOpeningSearchService jobOpeningSearchService;
    private final AuthService authService;

    @PostMapping("/advanced-search")
    public ResponseEntity<SearchResultPage<Opening>> advancedSearch(@RequestBody JobOpeningSearchRequest request) {
        User currentUser = authService.getCurrentUser();
        SearchResultPage<Opening> results = jobOpeningSearchService.advancedSearch(request, currentUser);
        return ResponseEntity.ok(results);
    }
}
