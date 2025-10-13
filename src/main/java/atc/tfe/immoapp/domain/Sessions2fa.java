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
@Table(name = "sessions_2fa", indexes = {
        @Index(name = "idx_sessions_2fa_user", columnList = "user_id"),
        @Index(name = "idx_sessions_2fa_expires", columnList = "expires_at")
})
public class Sessions2fa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 10)
    @NotNull
    @Column(name = "otp", nullable = false, length = 10)
    private String otp;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "consumed", nullable = false)
    private Boolean consumed = false;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "attempts", nullable = false)
    private Short attempts;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}