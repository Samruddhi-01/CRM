package com.startica.privateapp.opening.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.startica.privateapp.model.Candidate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_openings", indexes = {
    @Index(name = "idx_candidate_opening_candidate", columnList = "candidate_id"),
    @Index(name = "idx_candidate_opening_opening", columnList = "opening_id"),
    @Index(name = "idx_candidate_opening_applied_at", columnList = "applied_at"),
    @Index(name = "idx_candidate_opening_status", columnList = "application_status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateOpening {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonIgnoreProperties("candidateOpenings")
    private Candidate candidate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opening_id", nullable = false)
    @JsonIgnoreProperties("candidateOpenings")
    private Opening opening;
    
    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;
    
    @Column(name = "application_status", length = 50)
    private String applicationStatus; // APPLIED, REVIEWING, SHORTLISTED, REJECTED, HIRED
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "applied_by", nullable = false)
    private Long appliedBy; // User ID who applied the candidate to this opening
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (applicationStatus == null) {
            applicationStatus = "APPLIED";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
