package com.startica.privateapp.repository;

import com.startica.privateapp.model.CandidateHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CandidateHistoryRepository extends JpaRepository<CandidateHistory, Long> {

    List<CandidateHistory> findByCandidateIdOrderByTimestampDesc(Long candidateId);

    Page<CandidateHistory> findByCandidateId(Long candidateId, Pageable pageable);

    @Query("SELECT ch FROM CandidateHistory ch WHERE " +
           "ch.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY ch.timestamp DESC")
    List<CandidateHistory> findByTimestampBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ch FROM CandidateHistory ch WHERE " +
           "ch.actorId = :actorId " +
           "ORDER BY ch.timestamp DESC")
    Page<CandidateHistory> findByActorId(@Param("actorId") Long actorId, Pageable pageable);
}

