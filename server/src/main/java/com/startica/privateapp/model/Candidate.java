package com.startica.privateapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.startica.privateapp.opening.model.CandidateOpening;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject; // add this import


@Entity
@Table(name = "candidates", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_source_hr_id", columnList = "source_hr_id"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_phone", columnList = "phone")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", length = 80)
    private String firstName;

    @Column(name = "last_name", length = 80)
    private String lastName;

    @Column(length = 120)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 120)
    private String location;

    @Column(length = 120)
    private String company;

    @Column(length = 120)
    private String profile;

    @Column(length = 80)
    private String degree;

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(name = "percentage")
    private Float percentage;


    @Column(length = 50)
    private String experience;

    @Column(name = "current_package", length = 50)
    private String currentPackage;

    @Column(name = "expected_ctc", length = 50)
    private String expectedCTC;

    @Column(length = 50)
    private String gap;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidateStatus status = CandidateStatus.PENDING;

    @Column(name = "source_hr_id")
    private Long sourceHrId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "hr_remark", columnDefinition = "TEXT")
    private String hrRemark;

    @Column(name = "admin_remark", columnDefinition = "TEXT")
    private String adminRemark;

    @Column(name = "employment_history", columnDefinition = "TEXT")
    private String employmentHistory;

    @Column(name = "education", columnDefinition = "TEXT")
    private String education;

    @Column(name = "experience_level", length = 120)
    private String experienceLevel;

    @Column(name = "notice_period", length = 50)
    private String noticePeriod;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"candidate", "opening"})
    private List<CandidateOpening> candidateOpenings = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//        updatedAt = LocalDateTime.now();
//        if (status == null) {
//            status = CandidateStatus.PENDING;
//        }
//        updatePercentageFromEducation();
//
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        updatedAt = LocalDateTime.now();
//        updatePercentageFromEducation(); // call helper
//
//    }
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();

    if (status == null) {
        status = CandidateStatus.PENDING;
    }

    updatePercentageFromEducation();   // 🔥
}

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updatePercentageFromEducation();   // 🔥
    }

    public enum CandidateStatus {
        PENDING,
        INTERESTED,
        NOT_INTERESTED,
        TELL_LATER,
        CONTACTED,
        OFFERED,
        HIRED
    }
    // Helper method to extract percentage from education JSON
//    public void updatePercentageFromEducation() {
//        if (education != null && !education.isEmpty()) {
//            try {
//                JSONObject eduJson = new JSONObject(education);
//                if (eduJson.has("percentage") && !eduJson.isNull("percentage")) {
//                    this.percentage = eduJson.getInt("percentage");
//                }
//            } catch (Exception e) {
//                // fallback if JSON is invalid
//                this.percentage = null;
//            }
//        }
//    }
//    public void updatePercentageFromEducation() {
//        if (education == null || education.trim().isEmpty()) {
//            this.percentage = null;
//            return;
//        }
//
//        try {
//            JSONObject eduJson = new JSONObject(education);
//
//            if (eduJson.has("percentage") && !eduJson.isNull("percentage")) {
//                this.percentage = (float) eduJson.getDouble("percentage");   // ✅ correct
//            }
//        } catch (Exception e) {
//            // If education is not JSON, do NOT destroy existing percentage
//            // Just keep whatever was already set
//        }
//    }
    public void updatePercentageFromEducation() {
        if (education == null || education.trim().isEmpty()) {
            return;
        }

        try {
            JSONObject eduJson = new JSONObject(education);

            if (eduJson.has("percentage") && !eduJson.isNull("percentage")) {
                this.percentage = (float) eduJson.getDouble("percentage");
            }
        } catch (Exception e) {
            // Invalid JSON – ignore
        }
    }


}

