package com.startica.privateapp.opening.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "openings", indexes = {
    @Index(name = "idx_opening_status", columnList = "status"),
    @Index(name = "idx_opening_department", columnList = "department"),
    @Index(name = "idx_opening_created_at", columnList = "created_at"),
    @Index(name = "idx_opening_created_by", columnList = "created_by")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Opening {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, length = 100)
    private String department;
    
    @Column(nullable = false, length = 150)
    private String location;
    
    @Column(length = 50)
    private String type; // Full-Time, Part-Time, Contract, Internship, Remote
    
    @Column(nullable = false)
    private Integer positions;
    
    @Column(length = 100)
    private String experience;
    
    @Column(name = "min_salary", length = 50)
    private String minSalary;
    
    @Column(name = "max_salary", length = 50)
    private String maxSalary;
    
    @Column(length = 500)
    private String skills; // Comma-separated
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String responsibilities;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OpeningStatus status;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (positions == null) {
            positions = 1;
        }
        if (status == null) {
            status = OpeningStatus.ACTIVE;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
