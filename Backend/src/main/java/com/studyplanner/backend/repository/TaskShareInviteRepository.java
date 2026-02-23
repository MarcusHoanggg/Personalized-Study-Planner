package com.studyplanner.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.studyplanner.backend.entity.TaskShareInvite;
import com.studyplanner.backend.entity.TaskShareInvite.InviteStatus;

public interface TaskShareInviteRepository extends JpaRepository<TaskShareInvite, Long> {

    // Find invite by invite token
    Optional<TaskShareInvite> findByInviteToken(String inviteToken);
    Optional<TaskShareInvite> findByToken(String inviteToken);

    // All pending invites for a given receiver in app notifications
    List<TaskShareInvite> findByReceiverIdAndStatus(Long receiverId, InviteStatus status);

    // All invites received by a user full history
    List<TaskShareInvite> findByReceiverId(Long receiverId);

    // All invites sent by a user full history
    List<TaskShareInvite> findBySenderId(Long senderId);

    // Check for dublicate invites for the same task and receiver
    boolean existsByReceiverIdAndTaskIdAndStatus(Long receiverId, Long taskId, InviteStatus status);

    // Load invite with sender and task details for email notifications
    @Query("SELECT i FROM TaskShareInvite i " +
            "JOIN FETCH i.sender s " +
            "JOIN FETCH i.receiver r " +
            "JOIN FETCH i.task t " +
            "WHERE i.inviteToken = :inviteToken")
    Optional<TaskShareInvite> findByTokenWithDetails(@Param("inviteToken") String inviteToken);

    // count unread pending invites for a user for app notifications badge
    long countByReceiverIdAndStatus(Long receiverId, InviteStatus status);

}
