package com.startica.privateapp.repository;

import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.Candidate.CandidateStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long>, JpaSpecificationExecutor<Candidate> {

    Optional<Candidate> findByEmail(String email);

    Optional<Candidate> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Page<Candidate> findByStatus(CandidateStatus status, Pageable pageable);

    Page<Candidate> findBySourceHrId(Long sourceHrId, Pageable pageable);

    @Query("SELECT c FROM Candidate c WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:sourceHrId IS NULL OR c.sourceHrId = :sourceHrId)")
    Page<Candidate> searchCandidates(@Param("search") String search,
                                     @Param("status") CandidateStatus status,
                                     @Param("sourceHrId") Long sourceHrId,
                                     Pageable pageable);

    @Query("SELECT COUNT(c) FROM Candidate c WHERE c.status = :status")
    Long countByStatus(@Param("status") CandidateStatus status);

    @Query("SELECT c FROM Candidate c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    List<Candidate> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(c) FROM Candidate c WHERE c.createdAt >= :date")
    Long countByCreatedAtAfter(@Param("date") LocalDateTime date);

    @Query("SELECT c.sourceHrId, COUNT(c) FROM Candidate c GROUP BY c.sourceHrId")
    List<Object[]> countCandidatesByHr();
@Query("SELECT MONTH(c.createdAt) as month, YEAR(c.createdAt) as year, COUNT(c) as count " +
        "FROM Candidate c WHERE c.createdAt >= :startDate " +
        "GROUP BY YEAR(c.createdAt), MONTH(c.createdAt) " +
        "ORDER BY year, month")
List<Object[]> getMonthlyStatistics(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT c.sourceHrId, c.status, COUNT(c) FROM Candidate c GROUP BY c.sourceHrId, c.status")
    List<Object[]> countCandidatesByHrAndStatus();

    @Query("SELECT MONTH(c.createdAt) as month, YEAR(c.createdAt) as year, COUNT(c) as count " +
           "FROM Candidate c WHERE c.createdAt >= :startDate " +
           "GROUP BY YEAR(c.createdAt), MONTH(c.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> getMonthlyStatistics();

    @Query("SELECT MONTH(c.createdAt) as month, YEAR(c.createdAt) as year, COUNT(c) as count " +
           "FROM Candidate c WHERE c.sourceHrId = :hrId AND c.createdAt >= :startDate " +
           "GROUP BY YEAR(c.createdAt), MONTH(c.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> getMonthlyStatisticsByHr(@Param("hrId") Long hrId, @Param("startDate") LocalDateTime startDate);

    Long countBySourceHrId(Long sourceHrId);

    Long countBySourceHrIdAndCreatedAtAfter(Long sourceHrId, LocalDateTime createdAt);

    // Global search method
    @Query("SELECT c FROM Candidate c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.skills) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Candidate> searchByText(@Param("query") String query, Pageable pageable);
    @Query(value = "SELECT " +
           "YEAR(c.createdAt) as year, " +
           "WEEK(c.createdAt) as week, " +
           "COUNT(c.id) as count " +
           "FROM Candidate c " +
           "WHERE c.createdAt IS NOT NULL " +
           "GROUP BY YEAR(c.createdAt), WEEK(c.createdAt) " +
           "ORDER BY YEAR(c.createdAt), WEEK(c.createdAt)",
           nativeQuery = true)
    List<Object[]> getWeeklyStatistics();

}
