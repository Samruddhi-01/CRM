package com.startica.privateapp.audit.service;

import com.startica.privateapp.audit.dto.CandidateHistoryResponse;
import com.startica.privateapp.model.Candidate;
import com.startica.privateapp.model.CandidateHistory;
import com.startica.privateapp.model.User;
import com.startica.privateapp.repository.CandidateHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final CandidateHistoryRepository historyRepository;

    @Transactional
    public void logCandidateCreation(Candidate candidate, User actor) {
        CandidateHistory history = new CandidateHistory();
        history.setCandidateId(candidate.getId());
        history.setAction("CANDIDATE_CREATED");
        history.setNewValue(formatCandidateData(candidate));
        history.setActorId(actor.getId());
        history.setActorRole(actor.getRole().name());
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);
    }

    @Transactional
    public void logCandidateUpdate(Long candidateId, String field, String oldValue, String newValue, User actor) {
        CandidateHistory history = new CandidateHistory();
        history.setCandidateId(candidateId);
        history.setAction("FIELD_UPDATED: " + field);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setActorId(actor.getId());
        history.setActorRole(actor.getRole().name());
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);
    }

    @Transactional
    public void logStatusChange(Long candidateId, String oldStatus, String newStatus, String comment, User actor) {
        CandidateHistory history = new CandidateHistory();
        history.setCandidateId(candidateId);
        history.setAction("STATUS_CHANGED");
        history.setOldValue(oldStatus);
        history.setNewValue(newStatus + (comment != null ? " - Comment: " + comment : ""));
        history.setActorId(actor.getId());
        history.setActorRole(actor.getRole().name());
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);
    }

    @Transactional
    public void logCandidateDeletion(Candidate candidate, User actor) {
        CandidateHistory history = new CandidateHistory();
        history.setCandidateId(candidate.getId());
        history.setAction("CANDIDATE_DELETED");
        history.setOldValue(formatCandidateData(candidate));
        history.setNewValue("Deleted by " + actor.getFullName());
        history.setActorId(actor.getId());
        history.setActorRole(actor.getRole().name());
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);
    }

    public List<CandidateHistoryResponse> getCandidateHistory(Long candidateId) {
        List<CandidateHistory> history = historyRepository.findByCandidateIdOrderByTimestampDesc(candidateId);
        return history.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<CandidateHistoryResponse> getCandidateHistoryPaginated(Long candidateId, Pageable pageable) {
        Page<CandidateHistory> history = historyRepository.findByCandidateId(candidateId, pageable);
        return history.map(this::mapToResponse);
    }

    public Page<CandidateHistoryResponse> getAuditLogsByActor(Long actorId, Pageable pageable) {
        Page<CandidateHistory> history = historyRepository.findByActorId(actorId, pageable);
        return history.map(this::mapToResponse);
    }

    private String formatCandidateData(Candidate candidate) {
        return String.format("Name: %s %s, Email: %s, Phone: %s, Status: %s",
                candidate.getFirstName(),
                candidate.getLastName(),
                candidate.getEmail(),
                candidate.getPhone(),
                candidate.getStatus());
    }

    private CandidateHistoryResponse mapToResponse(CandidateHistory history) {
        return CandidateHistoryResponse.builder()
                .id(history.getId())
                .candidateId(history.getCandidateId())
                .action(history.getAction())
                .oldValue(history.getOldValue())
                .newValue(history.getNewValue())
                .actorId(history.getActorId())
                .actorRole(history.getActorRole())
                .timestamp(history.getTimestamp())
                .build();
    }
}

