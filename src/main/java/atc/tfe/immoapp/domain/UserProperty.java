package atc.tfe.immoapp.domain;

import atc.tfe.immoapp.enums.ContextRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "user_properties",
        indexes = {
                @Index(name = "idx_user_properties_user", columnList = "user_id"),
                @Index(name = "idx_user_properties_property", columnList = "property_id")
        }
)
public class UserProperty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Enumerated(EnumType.STRING)
    @Column(name = "context_role", nullable = false)
    private ContextRole contextRole;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}