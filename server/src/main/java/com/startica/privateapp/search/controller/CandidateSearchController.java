package com.startica.privateapp.search.controller;

import com.startica.privateapp.search.dto.CandidateSearchRequest;
import com.startica.privateapp.search.dto.SearchResultPage;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.User;
import com.startica.privateapp.search.service.CandidateSearchService;
import com.startica.privateapp.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidateSearchController {

    private final CandidateSearchService candidateSearchService;
    private final AuthService authService;

    @PostMapping("/advanced-search")
    public ResponseEntity<SearchResultPage<Candidate>> advancedSearch(@RequestBody CandidateSearchRequest request) {
        User currentUser = authService.getCurrentUser();
        SearchResultPage<Candidate> results = candidateSearchService.advancedSearch(request, currentUser);
        return ResponseEntity.ok(results);
    }
}
