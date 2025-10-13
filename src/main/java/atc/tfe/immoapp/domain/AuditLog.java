package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.Action;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_logs_user", columnList = "user_id"),
        @Index(name = "idx_audit_logs_entity", columnList = "entity_type, entity_id"),
        @Index(name = "idx_audit_logs_action", columnList = "action")
})
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 64)
    @NotNull
    @Column(name = "entity_type", nullable = false, length = 64)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private Action action;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Size(max = 64)
    @Column(name = "ip", length = 64)
    private String ip;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "audit_log_at", nullable = false)
    private Instant auditLogAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}