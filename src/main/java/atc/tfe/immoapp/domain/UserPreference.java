package atc.tfe.immoapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "user_preferences", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_preferences_user", columnNames = {"user_id"})
})
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 10)
    @NotNull
    @ColumnDefault("'fr-BE'")
    @Column(name = "locale", nullable = false, length = 10)
    private String locale;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "notif_email", nullable = false)
    private Boolean notifEmail = false;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "notif_push", nullable = false)
    private Boolean notifPush = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}