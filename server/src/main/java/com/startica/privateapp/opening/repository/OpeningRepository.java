package com.startica.privateapp.opening.repository;

import com.startica.privateapp.opening.model.Opening;
import com.startica.privateapp.opening.model.OpeningStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Opening> {
    
    @Query("SELECT o FROM Opening o WHERE " +
           "(:search IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.department) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.location) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR o.status = :status) " +
           "AND (:department IS NULL OR LOWER(o.department) LIKE LOWER(CONCAT('%', :department, '%')))")
    Page<Opening> searchOpenings(@Param("search") String search,
                                  @Param("status") OpeningStatus status,
                                  @Param("department") String department,
                                  Pageable pageable);
    
    @Query("SELECT o FROM Opening o WHERE " +
           "o.createdBy = :createdBy " +
           "AND (:search IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.department) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(o.location) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR o.status = :status) " +
           "AND (:department IS NULL OR LOWER(o.department) LIKE LOWER(CONCAT('%', :department, '%')))")
    Page<Opening> searchOpeningsByCreatedBy(@Param("search") String search,
                                             @Param("status") OpeningStatus status,
                                             @Param("department") String department,
                                             @Param("createdBy") Long createdBy,
                                             Pageable pageable);
    
    List<Opening> findByStatus(OpeningStatus status);
    
    List<Opening> findByStatusAndCreatedBy(OpeningStatus status, Long createdBy);
    
    List<Opening> findByDepartment(String department);
    
    List<Opening> findByDepartmentAndCreatedBy(String department, Long createdBy);
    
    long countByStatus(OpeningStatus status);
    
    long countByStatusAndCreatedBy(OpeningStatus status, Long createdBy);
    
    List<Opening> findByCreatedBy(Long createdBy);
    
    // Global search method
    @Query("SELECT o FROM Opening o WHERE " +
           "LOWER(o.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.department) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Opening> searchByText(@Param("query") String query, Pageable pageable);
}
