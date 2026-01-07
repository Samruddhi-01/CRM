package com.startica.privateapp.opening.repository;

import com.startica.privateapp.opening.model.CandidateOpening;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateOpeningRepository extends JpaRepository<CandidateOpening, Long> {
    
    // Find all applications for a specific opening with pagination
    @Query("SELECT co FROM CandidateOpening co " +
           "WHERE co.opening.id = :openingId")
    Page<CandidateOpening> findByOpeningId(@Param("openingId") Long openingId, Pageable pageable);
    
    // Find all openings a candidate has applied to
    @Query("SELECT co FROM CandidateOpening co " +
           "LEFT JOIN FETCH co.candidate c " +
           "LEFT JOIN FETCH co.opening o " +
           "WHERE co.candidate.id = :candidateId " +
           "ORDER BY co.appliedAt DESC")
    List<CandidateOpening> findByCandidateId(@Param("candidateId") Long candidateId);
    
    // Check if a candidate has already applied to an opening
    Optional<CandidateOpening> findByCandidateIdAndOpeningId(Long candidateId, Long openingId);
    
    // Count applications for an opening
    long countByOpeningId(Long openingId);
    
    // Count applications by a candidate
    long countByCandidateId(Long candidateId);
    
    // Find applications by status
    List<CandidateOpening> findByApplicationStatus(String status);
    
    // Find applications for an opening by status
    @Query("SELECT co FROM CandidateOpening co " +
           "WHERE co.opening.id = :openingId " +
           "AND co.applicationStatus = :status " +
           "ORDER BY co.appliedAt DESC")
    List<CandidateOpening> findByOpeningIdAndStatus(@Param("openingId") Long openingId, 
                                                     @Param("status") String status);
    
    // Delete application
    void deleteByCandidateIdAndOpeningId(Long candidateId, Long openingId);
    
    // Get candidate IDs who applied to a specific opening
    @Query("SELECT co.candidate.id FROM CandidateOpening co WHERE co.opening.id = :openingId")
    List<Long> findCandidateIdsByOpeningId(@Param("openingId") Long openingId);
    
    // Get opening IDs a candidate applied to
    @Query("SELECT co.opening.id FROM CandidateOpening co WHERE co.candidate.id = :candidateId")
    List<Long> findOpeningIdsByCandidateId(@Param("candidateId") Long candidateId);
}
